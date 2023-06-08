import { ITodoRepository } from "../repositories/todo.repository";
import { ISubtaskRepository } from "../repositories/subtask.repository";
import { Todo, TodoResponse, TodoStatus } from "../models/todo";
import { SubtaskResponse } from "../models/subtask";

export interface ITodoService {
  getAllTodos(): Promise<TodoResponse[]>;
  getTodo(id: number): Promise<TodoResponse>;
  createTodo(title: string): Promise<TodoResponse>;
  updateTodoStatus(id: number, status: string): Promise<TodoResponse>;
}

export class TodoService {
  private todoRepository: ITodoRepository;
  private subtaskRepository: ISubtaskRepository;

  constructor(todoRepository: ITodoRepository, subtaskRepository: ISubtaskRepository) {
    this.todoRepository = todoRepository;
    this.subtaskRepository = subtaskRepository;
  }

  getAllTodos = async (): Promise<TodoResponse[]> => {
    const todos = await this.todoRepository.getAll();
    const response: TodoResponse[] = [];

    for (const todo of todos) {
      const res = TodoResponse.fromTodo(todo);

      if (todo.id) {
        const subtasks = await this.subtaskRepository.getByTodoId(todo.id);
        res.subtasks = subtasks.map((subtask) => SubtaskResponse.fromSubtask(subtask));
      }

      response.push(res);
    }

    return response;
  };

  getTodo = async (id: number): Promise<TodoResponse> => {
    const todo = await this.todoRepository.get(id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    const response = TodoResponse.fromTodo(todo);

    if (todo.id) {
      const subtasks = await this.subtaskRepository.getByTodoId(todo.id);
      response.subtasks = subtasks.map((subtask) => SubtaskResponse.fromSubtask(subtask));
    }

    return response;
  };

  createTodo = async (title: string): Promise<TodoResponse> => {
    const todo = new Todo(title, TodoStatus.Pending, new Date());
    const createdTodo = await this.todoRepository.create(todo);
    return TodoResponse.fromTodo(createdTodo);
  };

  updateTodoStatus = async (id: number, status: TodoStatus): Promise<TodoResponse> => {
    const todo = await this.todoRepository.get(id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    todo.status = status;
    const updatedTodo = await this.todoRepository.update(todo);
    return TodoResponse.fromTodo(updatedTodo);
  };
}
