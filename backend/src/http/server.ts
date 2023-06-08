import express from "express";
import cors from "cors";
import { Config } from "./config";
import { PostgresClient } from "../infrastructures/postgres";
import { SubtaskController } from "../controllers/subtask.controller";
import { SubtaskRepository } from "../repositories/subtask.repository";
import { SubtaskService } from "../services/subtask.service";
import { TodoController } from "../controllers/todo.controller";
import { TodoRepository } from "../repositories/todo.repository";
import { TodoService } from "../services/todo.service";

export async function startServer(config: Config) {
  const app = express();

  const pg = new PostgresClient(config.postgres);

  const subtaskRepo = new SubtaskRepository(pg);
  const subtaskService = new SubtaskService(subtaskRepo);
  const subtaskController = new SubtaskController(subtaskService);
  const subtaskRouter = createSubtaskRouter(subtaskController);

  const todoRepo = new TodoRepository(pg);
  const todoService = new TodoService(todoRepo, subtaskRepo);
  const todoController = new TodoController(todoService);
  const todoRouter = createTodoRouter(todoController);

  await todoRepo.createTableIfNotExists();
  await subtaskRepo.createTableIfNotExists();

  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
  app.use(cors());

  app.use("/todo", todoRouter);
  app.use("/subtask", subtaskRouter);

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

function createTodoRouter(controller: TodoController): express.Router {
  const router = express.Router();

  router.get("/", controller.getAllTodos);
  router.get("/:id", controller.getTodo);
  router.post("/", controller.createTodo);
  router.put("/:id/status", controller.updateTodoStatus);

  return router;
}

function createSubtaskRouter(controller: SubtaskController): express.Router {
  const router = express.Router();

  router.post("/", controller.createSubtask);
  router.put("/:id/status", controller.updateSubtaskStatus);

  return router;
}
