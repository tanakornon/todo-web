import { Subtask, SubtaskResponse } from "../models/subtask";
import { Todo, TodoResponse } from "../models/todo";

export const mapSubtask = (data: SubtaskResponse): Subtask => {
  return {
    id: data.id,
    todoId: data.todo_id,
    title: data.title,
    status: data.status,
    createdDate: data.created_at,
  };
};

export const mapTodo = (data: TodoResponse): Todo => {
  return {
    id: data.id,
    title: data.title,
    status: data.status,
    createdDate: data.created_at,
    subtasks: data.subtasks.map(mapSubtask),
  };
};
