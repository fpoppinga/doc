import { h, Component } from "preact";

export interface VisualCursorProps {
    name: string | undefined;
    color: string;
}

export class VisualCursor extends Component<VisualCursorProps, {}> {
    element?: Element;

    componentDidMount() {
        if (this.element) {
            this.element.setAttribute(
                "style",
                `--user-color: ${this.props.color};`
            );
        }
    }

    render() {
        return (
            <span class="cursor blinking" ref={n => (this.element = n)}>
                <label title={this.props.name}>
                    <span class="name">{this.props.name || "Unknown"}</span>
                </label>
            </span>
        );
    }
}
