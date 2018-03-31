import { h } from "preact";

import { Doc } from "../../../lib/doc";
import { shallow } from "preact-render-spy";
import { DisconnectedDocument } from "../document";
import { VisualCursor } from "../cursor";

describe("Document", () => {
    it("renders a document's text", () => {
        const doc = new Doc("This is only a test.", new Map());
        const context = shallow(
            <DisconnectedDocument
                doc={doc}
                onCaretMove={jest.fn()}
                onType={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(context.find(".content")).toHaveLength(1);
        expect(context.text()).toBe("This is only a test.");
    });

    it("renders a VisualCursor for each cursor in the document", () => {
        const doc = new Doc(
            "This is.",
            new Map([["1", { position: 1 }], ["2", { position: 0 }]])
        );
        const context = shallow(
            <DisconnectedDocument
                doc={doc}
                onCaretMove={jest.fn()}
                onType={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        expect(context.find("VisualCursor")).toHaveLength(2);
    });

    describe("Keyboard", () => {
        it("types text, when letters are typed", () => {
            const doc = new Doc("", new Map());
            const typeSpy = jest.fn();
            const context = shallow(
                <DisconnectedDocument
                    doc={doc}
                    onCaretMove={jest.fn()}
                    onType={typeSpy}
                    onDelete={jest.fn()}
                />
            );

            context.find(".content").simulate("keydown", { key: "a" });
            expect(typeSpy).toHaveBeenCalledWith("a");

            context.find(".content").simulate("keydown", { key: "Enter" });
            expect(typeSpy).toHaveBeenCalledWith("\n");
        });

        it("deletes text, when backspace or delete is hit", () => {
            const doc = new Doc("Aha.", new Map());
            const deleteSpy = jest.fn();
            const context = shallow(
                <DisconnectedDocument
                    doc={doc}
                    onCaretMove={jest.fn()}
                    onType={jest.fn()}
                    onDelete={deleteSpy}
                />
            );

            context.find(".content").simulate("keydown", { key: "Backspace" });
            expect(deleteSpy).toHaveBeenCalledWith(1);

            context.find(".content").simulate("keydown", { key: "Delete" });
            expect(deleteSpy).toHaveBeenCalledWith(-1);
        });

        it("moves the caret with the arrow keys", () => {
            const doc = new Doc("Aha aha.", new Map());
            const moveSpy = jest.fn();
            const context = shallow(
                <DisconnectedDocument
                    doc={doc}
                    onCaretMove={moveSpy}
                    onType={jest.fn()}
                    onDelete={jest.fn()}
                />
            );

            context.find(".content").simulate("keydown", { key: "ArrowLeft" });
            expect(moveSpy).toHaveBeenCalledWith(-1);

            context.find(".content").simulate("keydown", { key: "ArrowRight" });
            expect(moveSpy).toHaveBeenCalledWith(1);
        });
    });
});
