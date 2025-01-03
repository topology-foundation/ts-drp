import {
	ActionType,
	type DRP,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@ts-drp/object";

export class Chat implements DRP {
	operations: string[] = ["addMessage"];
	semanticsType: SemanticsType = SemanticsType.pair;
	// store messages as strings in the format (timestamp, message, peerId)
	messages: Set<string>;
	constructor() {
		this.messages = new Set<string>();
	}

	addMessage(timestamp: string, message: string, peerId: string): void {
		this._addMessage(timestamp, message, peerId);
	}

	private _addMessage(
		timestamp: string,
		message: string,
		peerId: string,
	): void {
		this.messages.add(`(${timestamp}, ${message}, ${peerId})`);
	}

	getMessages(): Set<string> {
		return this.messages;
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		return { action: ActionType.Nop };
	}
}
