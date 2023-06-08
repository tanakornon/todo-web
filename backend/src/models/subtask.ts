export class Subtask {
  id?: number;
  todoId: number;
  title: string;
  status: SubtaskStatus;
  createdDate: Date;

  constructor(todoId: number, title: string, status: SubtaskStatus, createdDate: Date, id?: number) {
    this.id = id;
    this.todoId = todoId;
    this.title = title;
    this.status = status;
    this.createdDate = createdDate;
  }

  toSubtaskResponse(): SubtaskResponse {
    return new SubtaskResponse(this.id || 0, this.todoId, this.title, this.status, this.createdDate);
  }

  static fromSubtaskResponse(res: SubtaskResponse): Subtask {
    return new Subtask(res.todo_id, res.title, res.status, res.created_at, res.id);
  }

  static fromSubtaskRow(row: any): Subtask {
    return new Subtask(row.todo_id, row.title, row.status, row.created_date, row.id);
  }
}

export class SubtaskResponse {
  id: number;
  todo_id: number;
  title: string;
  status: SubtaskStatus;
  created_at: Date;

  constructor(id: number, todoId: number, title: string, status: SubtaskStatus, created_at: Date) {
    this.id = id;
    this.todo_id = todoId;
    this.title = title;
    this.status = status;
    this.created_at = created_at;
  }

  static fromSubtask(subtask: Subtask): SubtaskResponse {
    return new SubtaskResponse(subtask.id || 0, subtask.todoId, subtask.title, subtask.status, subtask.createdDate);
  }

  toSubtask(): Subtask {
    return new Subtask(this.todo_id, this.title, this.status, this.created_at, this.id);
  }
}

export enum SubtaskStatus {
  Pending = "pending",
  Completed = "completed",
}
