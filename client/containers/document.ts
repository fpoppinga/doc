import { connect } from "preact-redux";
import { DisconnectedDocument, DocumentProps } from "../components/document";
import { Dispatch } from "redux";
import { RootState } from "../reducers";
import { deleteText, moveCaret, typeText } from "../actions/documentActions";
import ComponentConstructor = preact.ComponentConstructor;

const mapStateToProps = (state: RootState) => ({
    doc: state.editor.doc
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
    onCaretMove: (distance: number) => {
        console.info("MOVE!");
        dispatch(moveCaret(distance));
    },
    onType: (char: string) => {
        dispatch(typeText(char));
    },
    onDelete: (length: number) => {
        dispatch(deleteText(length));
    }
});

export const Document = connect(mapStateToProps, mapDispatchToProps)(
    DisconnectedDocument as ComponentConstructor<DocumentProps, {}>
);
