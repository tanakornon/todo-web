import { Subtask } from "../models/subtask";
import { Todo } from "../models/todo";

export const ascendingTodoId = (a: Todo, b: Todo) => a.id! - b.id!;
export const ascendingSubtaskId = (a: Subtask, b: Subtask) => a.id! - b.id!;
