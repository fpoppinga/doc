import { combineReducers, Reducer } from "redux";
import { editorReducer, EditorState } from "./editorReducer";

export type RootState = {
    editor: EditorState;
};

export default combineReducers<RootState>({
    editor: editorReducer as Reducer<EditorState>
});
