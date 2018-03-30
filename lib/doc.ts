export interface Cursor {
    position: number;
}

export class Doc {
    constructor(readonly text: string, readonly cursors: Map<string, Cursor>) {}

    insertAt(cursorId: string, text: string): Doc {
        const cursor = this.getOrCreateCursor(cursorId);

        const [beforeCursor, afterCursor] = this.sliceAt(cursor);
        return new Doc(
            beforeCursor + text + afterCursor,
            this.moveCursors(cursor.position, text.length)
        );
    }

    deleteAt(cursorId: string, length: number): Doc {
        const cursor = this.getOrCreateCursor(cursorId);
        const [beforeCursor, afterCursor] = this.sliceAt(cursor);

        return new Doc(
            beforeCursor.slice(0, cursor.position - length) + afterCursor,
            this.moveCursors(cursor.position, -length)
        );
    }

    moveCursors(after: number, length: number): Map<string, Cursor> {
        let position = after;
        const step = length >= 0 ? 1 : -1;

        const result = new Map(this.cursors.entries());

        while (position !== after + length || (position === 0 && step < 0)) {
            for (const [, cursor] of result) {
                if (cursor.position >= position) {
                    cursor.position += step;
                }
            }

            position += step;
        }

        return result;
    }

    private getOrCreateCursor(cursorId: string): Cursor {
        const cursor = this.cursors.get(cursorId);
        if (cursor) {
            return cursor;
        }

        const newCursor: Cursor = { position: 0 };
        this.cursors.set(cursorId, newCursor);
        return newCursor;
    }

    private sliceAt(cursor: Cursor): [string, string] {
        const beforeCursor = this.text.slice(0, cursor.position);
        const afterCursor = this.text.slice(cursor.position, this.text.length);

        return [beforeCursor, afterCursor];
    }
}
