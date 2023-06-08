import { Reducer } from "redux";
import { Todo } from "../models/todo";
import {
  AppActions,
  ADD_TODO,
  UPDATE_TODO_STATUS,
  INITIAL_TODOS,
  ADD_SUBTASK,
  UPDATE_SUBTASK_STATUS,
} from "../types/actions";

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

export const todoReducer: Reducer<TodoState, AppActions> = (state = initialState, action) => {
  switch (action.type) {
    case INITIAL_TODOS:
      const todos = action.payload;
      return {
        ...state,
        todos,
      };
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case ADD_SUBTASK:
      const addTodoId = action.payload.todoId;
      const subtask = action.payload.subtask;

      const updatedTodosWithSubtask = state.todos.map((todo) =>
        todo.id === addTodoId ? { ...todo, subtasks: [...todo.subtasks, subtask] } : todo
      );

      return {
        ...state,
        todos: updatedTodosWithSubtask,
      };
    case UPDATE_TODO_STATUS:
      const updatedTodos = state.todos.map((todo) =>
        todo.id === action.payload.id ? { ...todo, status: action.payload.status } : todo
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    case UPDATE_SUBTASK_STATUS:
      const updateTodoId = action.payload.todoId;
      const subtaskId = action.payload.subtaskId;
      const status = action.payload.status;

      const updatedTodosWithSubtaskStatus = state.todos.map((todo) => {
        if (todo.id === updateTodoId) {
          const updatedSubtasks = todo.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, status } : subtask
          );
          return { ...todo, subtasks: updatedSubtasks };
        }
        return todo;
      });

      return {
        ...state,
        todos: updatedTodosWithSubtaskStatus,
      };
    default:
      return state;
  }
};
