import { SubtaskResponse } from "./subtask";

export class Todo {
  id?: number;
  title: string;
  status: TodoStatus;
  createdDate: Date;

  constructor(title: string, status: TodoStatus, createdDate: Date, id?: number) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.createdDate = createdDate;
  }

  toTodoResponse(subtasks: SubtaskResponse[]): TodoResponse {
    return new TodoResponse(this.id || 0, this.title, this.status, this.createdDate, subtasks);
  }

  static fromTodoResponse(res: TodoResponse): Todo {
    return new Todo(res.title, res.status, res.created_at, res.id);
  }

  static fromTodoRow(row: any): Todo {
    return new Todo(row.title, row.status, row.created_date, row.id);
  }
}

export class TodoResponse {
  id: number;
  title: string;
  status: TodoStatus;
  created_at: Date;
  subtasks: SubtaskResponse[];

  constructor(id: number, title: string, status: TodoStatus, created_at: Date, subtasks: SubtaskResponse[]) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.created_at = created_at;
    this.subtasks = subtasks;
  }

  toTodo(): Todo {
    return new Todo(this.title, this.status, this.created_at, this.id);
  }

  static fromTodo(todo: Todo): TodoResponse {
    return new TodoResponse(todo.id || 0, todo.title, todo.status, todo.createdDate, []);
  }
}

export enum TodoStatus {
  Pending = "pending",
  Completed = "completed",
}
