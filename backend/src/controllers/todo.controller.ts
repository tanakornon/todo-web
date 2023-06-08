import { Request, Response } from "express";
import { ITodoService } from "../services/todo.service";
import { TodoStatus } from "../models/todo";

export class TodoController {
  private todoService: ITodoService;

  constructor(todoService: ITodoService) {
    this.todoService = todoService;
  }

  getAllTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const todos = await this.todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      console.error("Error retrieving todos:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }

      const todos = await this.todoService.getTodo(parsedId);
      res.json(todos);
    } catch (error) {
      console.error("Error retrieving todos:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  createTodo = async (req: Request, res: Response): Promise<void> => {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "Missing required attribute: title" });
      return;
    }

    try {
      const createdTodo = await this.todoService.createTodo(title);
      res.status(201).json(createdTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateTodoStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Missing required attribute: status" });
      return;
    }

    if (!Object.values(TodoStatus).includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }

      const updatedTodo = await this.todoService.updateTodoStatus(parsedId, status);
      res.json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
