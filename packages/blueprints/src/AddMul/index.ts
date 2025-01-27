import {
	ActionType,
	type DRP,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@ts-drp/object";

export class AddMulDRP implements DRP {
	semanticsType = SemanticsType.pair;

	private _value: number;
	private _peerId: string;

	constructor(peerId: string) {
		this._peerId = peerId;
		this._value = 0;
	}

	resolveConflicts(vertex: Vertex[]): ResolveConflictsType {
		console.log("resolveConflicts", vertex);
		const mulOp = "mul";
		const addOp = "add";

		if (vertex.length === 0) {
			return { action: ActionType.Nop };
		}

		const leftOp = vertex[0].operation;
		const rightOp = vertex[1].operation;
		if (!leftOp || !rightOp) {
			return { action: ActionType.Nop };
		}

		const leftOpType = leftOp.opType;
		const rightOpType = rightOp.opType;

		// mul is always to be made after add
		if (rightOpType === addOp && leftOpType === mulOp) {
			return { action: ActionType.Swap };
		}

		return { action: ActionType.Nop };
	}

	add(value: number): void {
		this._value += value;
		console.log("add", this._peerId, value, this._value);
	}

	mul(value: number): void {
		this._value *= value;
		console.log("mul", value, this._value);
	}

	query_value(): number {
		console.log("query_value", this._value);
		return this._value;
	}
}
