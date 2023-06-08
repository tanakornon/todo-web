import { ADD_TODO, UPDATE_TODO_STATUS, INITIAL_TODOS } from "../types/actions";
import { Todo, TodoStatus } from "../models/todo";

export const initialTodos = (todos: Todo[]) => ({
  type: INITIAL_TODOS,
  payload: todos,
});

export const addTodo = (todo: Todo) => ({
  type: ADD_TODO,
  payload: todo,
});

export const updateTodoStatus = (id: number, status: TodoStatus) => ({
  type: UPDATE_TODO_STATUS,
  payload: {
    id,
    status,
  },
});
