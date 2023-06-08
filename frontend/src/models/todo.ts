import { Subtask, SubtaskResponse } from "./subtask";

export interface Todo {
  id?: number;
  title: string;
  status: TodoStatus;
  createdDate: Date;
  subtasks: Subtask[];
}

export interface TodoResponse {
  id: number;
  title: string;
  status: TodoStatus;
  created_at: Date;
  subtasks: SubtaskResponse[];
}

export enum TodoStatus {
  Pending = "pending",
  Completed = "completed",
}
