import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { TodoState, todoReducer } from "./reducers/todoReducer";
import { AppActions } from "./types/actions";

export interface RootState {
  todos: TodoState;
}

const rootReducer = combineReducers<RootState, AppActions>({
  todos: todoReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware],
});

export type AppDispatch = typeof store.dispatch;

export default store;
