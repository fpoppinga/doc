import { h, FunctionalComponent } from "preact";
import { Doc } from "../../lib/doc";
import { Cursor } from "./cursor";

export interface DocumentProps {
    readonly doc: Doc;
    readonly onCaretMove: (distance: number) => void;
    readonly onType: (text: string) => void;
    readonly onDelete: (length: number) => void;
}

const arrowKeys: Map<string, number> = new Map([
    ["ArrowLeft", -1],
    ["ArrowRight", +1]
]);

export const DisconnectedDocument: FunctionalComponent<DocumentProps> = (
    props?: DocumentProps
) => {
    if (!props) return <div />;

    function handleKeyDown(e: KeyboardEvent) {
        const key = e.key;
        console.info("Keydown!", key);
        if (arrowKeys.has(key)) {
            return props && props.onCaretMove(arrowKeys.get(key)!);
        }

        if (key === "Backspace") {
            return props && props.onDelete(1);
        }

        if (key === "Delete") {
            return props && props.onDelete(-1);
        }

        if (key.length === 1) {
            return props && props.onType(key);
        }

        e.preventDefault();
    }

    return (
        <div class="container">
            <div class="content" tabIndex={0} onKeyDown={handleKeyDown}>
                {props.doc.text}
            </div>
            {[...props.doc.cursors.values()].map(cursor => (
                <Cursor {...cursor} />
            ))}
        </div>
    );
};
