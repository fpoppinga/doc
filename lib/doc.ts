export interface Cursor {
    name?: string;
    position: number;
}

export class Doc {
    readonly cursors: Map<string, Cursor>;

    constructor(readonly text: string, cursors: Map<string, Cursor>) {
        this.cursors = this.normalizeCursors(cursors);
    }

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

        const deletionLength = Math.min(length, cursor.position);

        return new Doc(
            beforeCursor.slice(0, cursor.position - deletionLength) + afterCursor,
            this.moveCursors(cursor.position, -deletionLength)
        );
    }

    moveCursor(cursorId: string, distance: number): Doc {
        const cursor = this.getOrCreateCursor(cursorId);
        const newCursors = new Map(this.cursors.entries());

        newCursors.set(cursorId, {
            ...cursor,
            position: cursor.position + distance
        });

        return new Doc(this.text, newCursors);
    }

    private moveCursors(after: number, length: number): Map<string, Cursor> {
        let position = after;
        const step = length >= 0 ? 1 : -1;

        const result = new Map(this.cursors.entries());

        while (position !== after + length) {
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

    private normalizeCursors(
        cursors: Map<string, Cursor>
    ): Map<string, Cursor> {
        const normalizedCursors: [string, Cursor][] = [
            ...cursors.entries()
        ].map(entry => {
            const [key, cursor] = entry;

            let position = cursor.position;
            if (position < 0) {
                position = 0;
            } else if (position > this.text.length) {
                position = this.text.length;
            }
            return [key, { ...cursor, position: position }] as [string, Cursor];
        });

        return new Map(normalizedCursors);
    }
}
