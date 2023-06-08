export interface Subtask {
  id?: number;
  todoId: number;
  title: string;
  status: SubtaskStatus;
  createdDate: Date;
}

export interface SubtaskResponse {
  id: number;
  todo_id: number;
  title: string;
  status: SubtaskStatus;
  created_at: Date;
}

export enum SubtaskStatus {
  Pending = "pending",
  Completed = "completed",
}
