import { h, FunctionalComponent, Component } from "preact";
import { Doc, Cursor } from "../../lib/doc";
import { VisualCursor } from "./cursor";

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

export class DisconnectedDocument extends Component<DocumentProps, {}> {
    constructor(props: DocumentProps) {
        super(props);
    }

    private handleKeyDown(e: KeyboardEvent) {
        const key = e.key;
        if (arrowKeys.has(key)) {
            return this.props.onCaretMove(arrowKeys.get(key)!);
        }

        if (key === "Backspace") {
            return this.props.onDelete(1);
        }

        if (key === "Delete") {
            return this.props.onDelete(-1);
        }

        if (key === "Enter") {
            return this.props.onType("\n");
        }

        if (key.length === 1) {
            return this.props.onType(key);
        }

        e.preventDefault();
    }

    private splitAtCursors(): (string | JSX.Element)[] {
        const sortedCursors = [...this.props.doc.cursors.entries()].sort(
            (a, b) => a[1].position - b[1].position
        );
        const segments = [];
        const chars = this.props.doc.text.split("");
        let i = 0;
        for (const [, cursor] of sortedCursors) {
            let currentSegment = "";
            while (i < cursor.position && i < chars.length) {
                currentSegment += chars[i];
                i++;
            }
            segments.push(currentSegment);
            segments.push(<VisualCursor color={"green"} name={cursor.name} />);
        }

        let lastSegment = "";
        while (i < chars.length) {
            lastSegment += chars[i];
            i++;
        }
        segments.push(lastSegment);
        return segments;
    }

    render() {
        const segments = this.splitAtCursors();

        return (
            <div class="container">
                <div class="document">
                    <pre
                        class="content"
                        tabIndex={0}
                        onKeyDown={this.handleKeyDown.bind(this)}
                    >
                        {segments}
                    </pre>
                </div>
            </div>
        );
    }
}
