import { Request, Response } from "express";
import { SubtaskController } from "../src/controllers/subtask.controller";
import { ISubtaskService } from "../src/services/subtask.service";
import { SubtaskResponse, SubtaskStatus } from "../src/models/subtask";

describe("SubtaskController", () => {
  let subtaskService: ISubtaskService;
  let subtaskController: SubtaskController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    subtaskService = {
      createSubtask: jest.fn(),
      updateSubtaskStatus: jest.fn(),
      deleteSubtask: jest.fn(),
    };

    subtaskController = new SubtaskController(subtaskService);

    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  describe("createSubtask", () => {
    beforeEach(() => {
      req.body = { title: "New Subtask", todo_id: 1 };
    });

    it("should create a new subtask", async () => {
      const createdSubtask = new SubtaskResponse(1, 1, "New Subtask", SubtaskStatus.Pending, new Date());
      jest.spyOn(subtaskService, "createSubtask").mockResolvedValue(createdSubtask);

      await subtaskController.createSubtask(req, res);

      expect(subtaskService.createSubtask).toHaveBeenCalledWith("New Subtask", 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdSubtask);
    });

    it("should handle missing attributes and return 400 status code", async () => {
      req.body = {};

      await subtaskController.createSubtask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required attributes: title, todo_id" });
    });

    it("should handle errors and return 500 status code", async () => {
      const error = new Error("Internal Server Error");
      jest.spyOn(subtaskService, "createSubtask").mockRejectedValue(error);

      await subtaskController.createSubtask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("updateSubtaskStatus", () => {
    beforeEach(() => {
      req.params = { id: "1" };
      req.body = { status: SubtaskStatus.Completed };
    });

    it("should update the status of a subtask", async () => {
      const updatedSubtask = new SubtaskResponse(1, 1, "Subtask 1", SubtaskStatus.Completed, new Date());
      jest.spyOn(subtaskService, "updateSubtaskStatus").mockResolvedValue(updatedSubtask);

      await subtaskController.updateSubtaskStatus(req, res);

      expect(subtaskService.updateSubtaskStatus).toHaveBeenCalledWith(1, SubtaskStatus.Completed);
      expect(res.json).toHaveBeenCalledWith(updatedSubtask);
    });

    it("should handle missing status attribute and return 400 status code", async () => {
      req.body = {};

      await subtaskController.updateSubtaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing required attribute: status" });
    });

    it("should handle invalid status and return 400 status code", async () => {
      req.body = { status: "invalid" };

      await subtaskController.updateSubtaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid status" });
    });

    it("should handle invalid id and return 400 status code", async () => {
      req.params = { id: "invalid" };

      await subtaskController.updateSubtaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid id" });
    });

    it("should handle errors and return 500 status code", async () => {
      const error = new Error("Internal Server Error");
      jest.spyOn(subtaskService, "updateSubtaskStatus").mockRejectedValue(error);

      await subtaskController.updateSubtaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
