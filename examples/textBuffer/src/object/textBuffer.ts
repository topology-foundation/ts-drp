import {
	ActionType,
	type DRP,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@ts-drp/object";
import { getColorForPeerId } from "../utils/color";

export type Insert = {
	content: string;
	id: Identifier;
	parent: Identifier | null; // determine the order of inserts with the same parent
	counter: number; // determine the order of inserts with the same parent
	color: string;
};

export type Identifier = {
	peerId: string;
	clock: number; // this clock is specific to the peer it increases after every operation
};

function isSameIdentifier(a: Identifier | null, b: Identifier | null): boolean {
	return (
		(a === null && b === null) ||
		(a !== null && b !== null && a.peerId === b.peerId && a.clock === b.clock)
	);
}

function childrenWithSameParentAreInOrder(
	before: Insert,
	after: Insert,
): boolean {
	return (
		before.counter > after.counter ||
		(before.counter === after.counter && before.id.peerId < after.id.peerId)
	);
}

function addToVersion(version: StateVector, insert: Insert): void {
	version[insert.id.peerId] = Math.max(
		version[insert.id.peerId] ?? -1,
		lastClock(insert),
	);
}

function lastClock(insert: Insert): number {
	return insert.id.clock + insert.content.length - 1;
}
function includeInVersion(version: StateVector, site: string, clock: number) {
	version[site] = Math.max(version[site] ?? -1, clock);
}

function remainingInsertAfterClock(insert: Insert, clock: number): Insert {
	return {
		id: { peerId: insert.id.peerId, clock: clock + 1 },
		parent: { peerId: insert.id.peerId, clock },
		counter: insert.counter,
		content: insert.content.slice(clock + 1 - insert.id.clock),
		color: insert.color,
	};
}

export type StateVector = Record<string, number>;

export type Delete = {
	version: StateVector; // All sites that deleted something in this range
	peerId: string;
	start: number; // The clock for the start of the deleted range
	end: number; // The clock for the end of the deleted range
};

export class TextBuffer implements DRP {
	semanticsType: SemanticsType = SemanticsType.pair;
	private _inserts: Insert[];
	private _deletes: Delete[];
	private _current_position: number;
	private _version: StateVector;

	constructor() {
		this._inserts = [];
		this._deletes = [];
		this._version = {};
		this._current_position = 0;
	}

	insert(index: number, text: string, peerId: string): void {
		if (!text) return; // nothing to insert

		const { insertIndex, offset } = this.query_indexToInsertText(index);
		const clock = (this._version[peerId] ?? -1) + 1;

		const insert: Insert = {
			id: { peerId, clock },
			parent: null,
			counter: 0,
			content: text,
			color: getColorForPeerId(peerId),
		};

		// case 1: we are inserting in the middle of an insert
		if (offset > 0) {
			const insertToSplit = this._inserts[insertIndex];

			insert.parent = {
				peerId: insertToSplit.id.peerId,
				clock: insertToSplit.id.clock + offset - 1,
			};
			insert.counter = insertToSplit.counter + 1;
			this.query_integrateInsert(insert);
			return;
		}

		// case 2: when insert index is greater than 0 we have to set the parent to the last clock of the insert before
		if (insertIndex > 0) {
			const insertBefore = this._inserts[insertIndex - 1];
			insert.parent = {
				peerId: insertBefore.id.peerId,
				clock: lastClock(insertBefore),
			};
			insert.counter = insertBefore.counter;
		}

		if (insertIndex < this._inserts.length) {
			const insertAfter = this._inserts[insertIndex];
			if (
				isSameIdentifier(insert.parent, insertAfter.parent) &&
				!childrenWithSameParentAreInOrder(insert, insertAfter)
			) {
				insert.counter = insertAfter.counter + 1;
			}
		}
		console.log("tryToMergeInsertWithPrevious", insert.id.clock);
		this.query_integrateInsert(insert);
	}

	delete(index: number, textLength: number, peerId: string): void {
		if (textLength < 1) return; // Do nothing for an empty delete

		let { insertIndex, offset } = this.query_indexToInsertText(index);
		let clock = (this._version[peerId] ?? -1) + 1;
		const deletes: Delete[] = [];

		let textStart = index;
		for (
			const textEnd = textStart + textLength;
			textStart < textEnd;
			insertIndex++, offset = 0
		) {
			const insert = this._inserts[insertIndex];
			if (this.query_isDeleted(insert.id)) continue;

			const end = Math.min(
				insert.id.clock + offset + textEnd - textStart,
				lastClock(insert) + 1,
			);

			deletes.push({
				version: { [peerId]: clock++ },
				peerId,
				start: insert.id.clock + offset,
				end,
			});
			textStart += insert.content.length - offset;
		}

		for (const del of deletes) this.query_integrateDelete(del);
	}

	query_integrateDelete(del: Delete): void {
		for (const site in del.version) {
			includeInVersion(this._version, site, del.version[site]);
		}

		// Merge overlapping delete ranges
		const filteredDeletes: Delete[] = [];
		for (const oldDelete of this._deletes) {
			if (
				oldDelete.peerId === del.peerId &&
				oldDelete.end >= del.start &&
				del.end >= oldDelete.start
			) {
				for (const peerId in oldDelete.version) {
					del.version[peerId] = Math.max(
						del.version[peerId] ?? -1,
						oldDelete.version[peerId],
					);
				}
				del.start = Math.min(del.start, oldDelete.start);
				del.end = Math.max(del.end, oldDelete.end);
			} else {
				filteredDeletes.push(oldDelete);
			}
		}
		this._deletes = filteredDeletes;
		this._deletes.push(del);

		// Split overlapping inserts as necessary
		for (let i = 0; i < this._inserts.length; i++) {
			const insert = this._inserts[i];
			const start = insert.id.clock;
			const end = lastClock(insert) + 1;

			if (end <= del.start || start >= del.end) continue; // No overlap

			if (this.query_splitInsertIfNecessary(i, del.start - start)) i++; // Split at the start
			if (
				this.query_splitInsertIfNecessary(
					i,
					del.end - this._inserts[i].id.clock,
				)
			)
				i++; // Split at the end
		}

		// Remove content in the deleted range
		for (let i = 0; i < this._inserts.length; i++) {
			const insert = this._inserts[i];
			const start = insert.id.clock;
			const end = lastClock(insert) + 1;

			if (start >= del.start && end <= del.end) {
				// Completely deleted
				this._inserts.splice(i, 1);
				i--;
			}
		}
	}

	// case 2: we are inserting in the middle of an insert
	query_integrateInsert(insert: Insert): void {
		addToVersion(this._version, insert);

		let indexOfFirstChild = 0;
		if (insert.parent !== null) {
			const id = insert.parent;
			const insertIndex = this._inserts.findIndex(
				(insert) =>
					insert.id.peerId === id.peerId &&
					id.clock >= insert.id.clock &&
					id.clock <= lastClock(insert),
			);
			this.query_splitInsertIfNecessary(
				insertIndex,
				id.clock - this._inserts[insertIndex].id.clock + 1,
			);
			indexOfFirstChild = insertIndex + 1;
		}

		const spliceIndex = this.query_findSpliceIndex(indexOfFirstChild, insert);
		this._inserts.splice(spliceIndex, 0, insert);
		console.log(
			"tryToMergeInsertWithPrevious",
			this.query_tryToMergeInsertWithPrevious(spliceIndex),
		);
	}

	query_tryToMergeInsertWithPrevious(i: number): boolean {
		if (i <= 0) return false;

		const insert = this._inserts[i];
		console.log("tryToMergeInsertWithPrevious", i);
		console.log(
			"tryToMergeInsertWithPrevious",
			insert.parent?.peerId,
			insert.id.peerId,
			insert.parent?.clock,
			insert.id.clock,
			insert.counter,
		);
		if (
			insert.parent !== null &&
			insert.id.peerId === insert.parent.peerId &&
			insert.id.clock === insert.parent.clock + 1
		) {
			const insertBefore = this._inserts[i - 1];
			console.log("insertBefore", insertBefore);
			console.log("insert", insert.id.peerId, insert.id.clock);
			console.log(
				"lastClock(insertBefore)",
				lastClock(insertBefore),
				insert.counter,
				insertBefore.counter,
			);
			if (
				insert.id.peerId === insertBefore.id.peerId &&
				insert.id.clock === lastClock(insertBefore) + 1 &&
				insert.counter === insertBefore.counter &&
				this.query_isDeleted(insert.id) ===
					this.query_isDeleted(insertBefore.id)
			) {
				insertBefore.content += insert.content;
				this._inserts.splice(i, 1);
				return true;
			}
		}

		return false;
	}

	query_findSpliceIndex(index: number, newInsert: Insert) {
		const haveSeen = new Set<string>();
		const newParentKey =
			newInsert.parent &&
			`${newInsert.parent.peerId} ${newInsert.parent.clock}`;
		for (let i = index; i < this._inserts.length; i++) {
			const insert = this._inserts[i];
			const parentKey =
				insert.parent && `${insert.parent.peerId} ${insert.parent.clock}`;
			if (parentKey === newParentKey) {
				if (childrenWithSameParentAreInOrder(newInsert, insert)) break; // Stop if we come before this sibling
			} else {
				if (parentKey === null || !haveSeen.has(parentKey)) break; // Stop if we left our parent's subtree
			}
			haveSeen.add(`${insert.id.peerId} ${lastClock(insert)}`); // Add the clock for the end of this insert
		}
		return index;
	}

	query_splitInsertIfNecessary(insertIndex: number, offset: number): boolean {
		if (offset <= 0) return false;

		const insert = this._inserts[insertIndex];
		if (insert.id.clock + offset > lastClock(insert)) return false;
		this._inserts.splice(
			insertIndex + 1,
			0,
			remainingInsertAfterClock(insert, insert.id.clock + offset - 1),
		);
		insert.content = insert.content.slice(0, offset);
		return true;
	}

	query_indexToInsertText(index: number): {
		insertIndex: number;
		offset: number;
	} {
		let currentPos = index;
		for (let i = 0; i < this._inserts.length; i++) {
			const { id, content } = this._inserts[i];

			if (this.query_isDeleted(id)) continue;

			if (currentPos < content.length)
				return { insertIndex: i, offset: currentPos };

			currentPos -= content.length;
		}

		return { insertIndex: this._inserts.length, offset: 0 };
	}

	query_isDeleted(id: Identifier): boolean {
		return this._deletes.some(
			({ peerId, start, end }) =>
				id.peerId === peerId && id.clock >= start && id.clock < end,
		);
	}

	remove(index: number): void {
		// TODO: Implement remove at position
		this._inserts.splice(index, 1);
	}

	resolveConflicts(_: Vertex[]): ResolveConflictsType {
		return { action: ActionType.Nop };
	}

	query_inserts(): Insert[] {
		return this._inserts;
	}

	query_content(): Insert[] {
		return this._inserts.filter((insert) => !this.query_isDeleted(insert.id));
	}

	query_text(): string {
		return this.query_content()
			.map((insert) => insert.content)
			.join("");
	}
}
