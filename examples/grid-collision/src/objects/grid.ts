import {
	ActionType,
	type DRP,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@ts-drp/object";

export class Grid implements DRP {
	semanticsType: SemanticsType = SemanticsType.pair;
	positions: Map<string, { x: number; y: number }>;

	constructor() {
		this.positions = new Map<string, { x: number; y: number }>();
	}

	addUser(userId: string, color: string): void {
		const userColorString = `${userId}:${color}`;

		// Increment the y axis from the starting position if there's a collision.
		// This is a simple way of doing it, however it does mean that if there's too much user
		// the grid will be filled with users on the same row.
		const startingPos = { x: 0, y: 0 };
		while (this.query_isColliding(userColorString, startingPos)) {
			startingPos.y += 1;
		}

		this.positions.set(userColorString, startingPos);
	}

	moveUser(userId: string, direction: string): void {
		const userColorString = [...this.positions.keys()].find((u) =>
			u.startsWith(`${userId}:`),
		);
		// Since there's no cases in which the userColorString is an empty string
		// we can use this to also check if userColorString is defined.
		const position = this.positions.get(userColorString ?? "");

		if (userColorString && position) {
			const newPos = this.query_computeNewPosition(position, direction);

			// Only move if its not colliding with other players.
			if (!this.query_isColliding(userColorString, newPos)) {
				this.positions.set(userColorString, newPos);
			}
		}
	}

	query_computeNewPosition(
		pos: { x: number; y: number },
		direction: string,
	): { x: number; y: number } {
		let deltaY = 0;
		let deltaX = 0;
		switch (direction) {
			case "U":
				deltaY += 1;
				break;
			case "D":
				deltaY -= 1;
				break;
			case "L":
				deltaX -= 1;
				break;
			case "R":
				deltaX += 1;
				break;
		}

		return { x: pos.x + deltaX, y: pos.y + deltaY };
	}

	query_users(): string[] {
		return [...this.positions.keys()];
	}

	query_userPosition(
		userColorString: string,
	): { x: number; y: number } | undefined {
		const position = this.positions.get(userColorString);
		if (position) {
			return position;
		}
		return undefined;
	}

	query_isColliding(
		userColorString: string,
		newCoords: { x: number; y: number },
	): boolean {
		let isColliding = false;
		for (const [key, value] of this.positions.entries()) {
			if (key !== userColorString) {
				if (value.x === newCoords.x && value.y === newCoords.y) {
					isColliding = true;
					break;
				}
			}
		}

		return isColliding;
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		console.log("resolveConflicts vertices:", vertices);

		return { action: ActionType.Nop };
	}
}

export function createGrid(): Grid {
	return new Grid();
}
