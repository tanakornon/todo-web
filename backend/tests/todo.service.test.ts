import { TodoService } from "../src/services/todo.service";
import { ITodoRepository } from "../src/repositories/todo.repository";
import { ISubtaskRepository } from "../src/repositories/subtask.repository";
import { Todo, TodoStatus } from "../src//models/todo";
import { Subtask, SubtaskStatus } from "../src//models/subtask";

describe("TodoService", () => {
  let todoService: TodoService;
  let todoRepository: ITodoRepository;
  let subtaskRepository: ISubtaskRepository;

  beforeEach(() => {
    todoRepository = {
      getAll: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    subtaskRepository = {
      create: jest.fn(),
      get: jest.fn(),
      getByTodoId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    todoService = new TodoService(todoRepository, subtaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("should retrieve all todos with subtasks", async () => {
      const todos: Todo[] = [
        new Todo("Todo 1", TodoStatus.Pending, new Date(), 1),
        new Todo("Todo 2", TodoStatus.Completed, new Date(), 2),
      ];

      const subtasks1: Subtask[] = [
        new Subtask(1, "Subtask 1", SubtaskStatus.Pending, new Date(), 1),
        new Subtask(1, "Subtask 2", SubtaskStatus.Completed, new Date(), 2),
      ];

      const subtasks2: Subtask[] = [];

      jest.spyOn(todoRepository, "getAll").mockResolvedValue(todos);
      jest.spyOn(subtaskRepository, "getByTodoId").mockResolvedValueOnce(subtasks1).mockResolvedValueOnce(subtasks2);

      const result = await todoService.getAllTodos();

      expect(todoRepository.getAll).toHaveBeenCalled();
      expect(subtaskRepository.getByTodoId).toHaveBeenCalledWith(1);
      expect(subtaskRepository.getByTodoId).toHaveBeenCalledWith(2);

      expect(result).toEqual([
        {
          id: 1,
          title: "Todo 1",
          status: TodoStatus.Pending,
          created_at: expect.any(Date),
          subtasks: [
            {
              id: 1,
              todo_id: 1,
              title: "Subtask 1",
              status: SubtaskStatus.Pending,
              created_at: expect.any(Date),
            },
            {
              id: 2,
              todo_id: 1,
              title: "Subtask 2",
              status: SubtaskStatus.Completed,
              created_at: expect.any(Date),
            },
          ],
        },
        {
          id: 2,
          title: "Todo 2",
          status: TodoStatus.Completed,
          created_at: expect.any(Date),
          subtasks: [],
        },
      ]);
    });
  });

  describe("getTodo", () => {
    it("should retrieve a todo with subtasks", async () => {
      const todo: Todo = new Todo("Todo 1", TodoStatus.Pending, new Date(), 1);

      const subtasks: Subtask[] = [
        new Subtask(1, "Subtask 1", SubtaskStatus.Pending, new Date(), 1),
        new Subtask(1, "Subtask 2", SubtaskStatus.Completed, new Date(), 2),
      ];

      jest.spyOn(todoRepository, "get").mockResolvedValue(todo);
      jest.spyOn(subtaskRepository, "getByTodoId").mockResolvedValue(subtasks);

      const result = await todoService.getTodo(1);

      expect(todoRepository.get).toHaveBeenCalledWith(1);
      expect(subtaskRepository.getByTodoId).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        id: 1,
        title: "Todo 1",
        status: TodoStatus.Pending,
        created_at: expect.any(Date),
        subtasks: [
          {
            id: 1,
            todo_id: 1,
            title: "Subtask 1",
            status: SubtaskStatus.Pending,
            created_at: expect.any(Date),
          },
          {
            id: 2,
            todo_id: 1,
            title: "Subtask 2",
            status: SubtaskStatus.Completed,
            created_at: expect.any(Date),
          },
        ],
      });
    });

    it("should throw an error if the todo is not found", async () => {
      jest.spyOn(todoRepository, "get").mockResolvedValue(null);

      await expect(todoService.getTodo(1)).rejects.toThrowError("Todo not found");

      expect(todoRepository.get).toHaveBeenCalledWith(1);
      expect(subtaskRepository.getByTodoId).not.toHaveBeenCalled();
    });
  });

  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const title = "New Todo";

      const createdTodo: Todo = new Todo(title, TodoStatus.Pending, new Date(), 1);

      jest.spyOn(todoRepository, "create").mockResolvedValue(createdTodo);

      const result = await todoService.createTodo(title);

      expect(todoRepository.create).toHaveBeenCalledWith({
        title,
        status: TodoStatus.Pending,
        createdDate: expect.any(Date),
      });

      expect(result).toEqual({
        id: 1,
        title,
        status: TodoStatus.Pending,
        created_at: expect.any(Date),
        subtasks: [],
      });
    });
  });

  describe("updateTodoStatus", () => {
    it("should update the status of a todo", async () => {
      const todo: Todo = new Todo("Todo 1", TodoStatus.Pending, new Date(), 1);

      const updatedTodo: Todo = new Todo("Todo 1", TodoStatus.Completed, new Date(), 1);

      jest.spyOn(todoRepository, "get").mockResolvedValue(todo);
      jest.spyOn(todoRepository, "update").mockResolvedValue(updatedTodo);

      const result = await todoService.updateTodoStatus(1, TodoStatus.Completed);

      expect(todoRepository.get).toHaveBeenCalledWith(1);
      expect(todoRepository.update).toHaveBeenCalledWith({
        id: 1,
        title: "Todo 1",
        status: TodoStatus.Completed,
        createdDate: expect.any(Date),
      });

      expect(result).toEqual({
        id: 1,
        title: "Todo 1",
        status: TodoStatus.Completed,
        created_at: expect.any(Date),
        subtasks: [],
      });
    });

    it("should throw an error if the todo is not found", async () => {
      jest.spyOn(todoRepository, "get").mockResolvedValue(null);

      await expect(todoService.updateTodoStatus(1, TodoStatus.Completed)).rejects.toThrowError("Todo not found");

      expect(todoRepository.get).toHaveBeenCalledWith(1);
      expect(todoRepository.update).not.toHaveBeenCalled();
    });
  });
});
