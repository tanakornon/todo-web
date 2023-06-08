import { Request, Response } from "express";
import { TodoController } from "../src/controllers/todo.controller";
import { ITodoService } from "../src/services/todo.service";
import { TodoResponse, TodoStatus } from "../src/models/todo";

describe("TodoController", () => {
  let todoService: ITodoService;
  let todoController: TodoController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    todoService = {
      getAllTodos: jest.fn(),
      getTodo: jest.fn(),
      createTodo: jest.fn(),
      updateTodoStatus: jest.fn(),
    };

    todoController = new TodoController(todoService);

    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe("getAllTodos", () => {
    it("should return all todos", async () => {
      const todos = [new TodoResponse(1, "Todo 1", TodoStatus.Pending, new Date(), [])];

      jest.spyOn(todoService, "getAllTodos").mockResolvedValue(todos);

      await todoController.getAllTodos(req, res);

      expect(todoService.getAllTodos).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it("should handle errors and return 500 status code", async () => {
      const error = new Error("Internal Server Error");
      jest.spyOn(todoService, "getAllTodos").mockRejectedValue(error);

      await todoController.getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("getTodo", () => {
    beforeEach(() => {
      req.params = { id: "1" };
    });

    it("should return a specific todo", async () => {
      const todo = new TodoResponse(1, "Todo 1", TodoStatus.Pending, new Date(), []);
      jest.spyOn(todoService, "getTodo").mockResolvedValue(todo);

      await todoController.getTodo(req, res);

      expect(todoService.getTodo).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(todo);
    });

    it("should handle invalid id and return 400 status code", async () => {
      req.params = { id: "invalid" };

      await todoController.getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid id" });
    });

    it("should handle errors and return 500 status code", async () => {
      const error = new Error("Internal Server Error");
      jest.spyOn(todoService, "getTodo").mockRejectedValue(error);

      await todoController.getTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("createTodo", () => {
    beforeEach(() => {
      req.body = { title: "New Todo" };
    });

    it("should create a new todo", async () => {
      const createdTodo = new TodoResponse(1, "New Todo", TodoStatus.Pending, new Date(), []);
      jest.spyOn(todoService, "createTodo").mockResolvedValue(createdTodo);

      await todoController.createTodo(req, res);

      expect(todoService.createTodo).toHaveBeenCalledWith("New Todo");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTodo);
    });

    it("should handle missing title attribute and return 400 status code", async () => {
      req.body = {};

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required attribute: title" });
    });

    it("should handle errors and return 500 status code", async () => {
      const error = new Error("Internal Server Error");
      jest.spyOn(todoService, "createTodo").mockRejectedValue(error);

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("updateTodoStatus", () => {
    beforeEach(() => {
      req.params = { id: "1" };
      req.body = { status: TodoStatus.Completed };
    });

    it("should update the status of a todo", async () => {
      const updatedTodo = new TodoResponse(1, "Todo 1", TodoStatus.Completed, new Date(), []);
      jest.spyOn(todoService, "updateTodoStatus").mockResolvedValue(updatedTodo);

      await todoController.updateTodoStatus(req, res);

      expect(todoService.updateTodoStatus).toHaveBeenCalledWith(1, TodoStatus.Completed);
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

    it("should handle missing status attribute and return 400 status code", async () => {
      req.body = {};

      await todoController.updateTodoStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required attribute: status" });
    });

    it("should handle invalid status and return 400 status code", async () => {
      req.body = { status: "invalid" };

      await todoController.updateTodoStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid status" });
    });

    it("should handle invalid id and return 400 status code", async () => {
      req.params = { id: "invalid" };

      await todoController.updateTodoStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid id" });
    });

    it("should handle errors and return 500 status code", async () => {
      const error = new Error("Internal Server Error");
      jest.spyOn(todoService, "updateTodoStatus").mockRejectedValue(error);

      await todoController.updateTodoStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
