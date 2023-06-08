import { Action } from "redux";
import { Todo, TodoStatus } from "../models/todo";
import { Subtask, SubtaskStatus } from "../models/subtask";

export const INITIAL_TODOS = "INITIAL_TODOS";
export const ADD_TODO = "ADD_TODO";
export const ADD_SUBTASK = "ADD_SUBTASK";
export const UPDATE_TODO_STATUS = "UPDATE_TODO_STATUS";
export const UPDATE_SUBTASK_STATUS = "UPDATE_SUBTASK_STATUS";

export interface InitialTodoAction extends Action<typeof INITIAL_TODOS> {
  payload: Todo[];
}

export interface AddTodoAction extends Action<typeof ADD_TODO> {
  payload: Todo;
}

export interface AddSubtaskAction extends Action<typeof ADD_SUBTASK> {
  payload: {
    todoId: number;
    subtask: Subtask;
  };
}

export interface UpdateTodoStatusAction extends Action<typeof UPDATE_TODO_STATUS> {
  payload: {
    id: number;
    status: TodoStatus;
  };
}

export interface UpdateSubtaskStatusAction extends Action<typeof UPDATE_SUBTASK_STATUS> {
  payload: {
    todoId: number;
    subtaskId: number;
    status: SubtaskStatus;
  };
}

export type AppActions =
  | InitialTodoAction
  | AddTodoAction
  | AddSubtaskAction
  | UpdateTodoStatusAction
  | UpdateSubtaskStatusAction;
