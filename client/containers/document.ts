import { connect } from "preact-redux";
import { DisconnectedDocument } from "../components/document";
import { Dispatch } from "redux";
import { RootState } from "../reducers";
import { deleteText, moveCaret, typeText } from "../actions/documentActions";

const mapStateToProps = (state: RootState) => ({
    doc: state.editor.doc
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
    onCaretMove: (distance: number) => {
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
    DisconnectedDocument
);
