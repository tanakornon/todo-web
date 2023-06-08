import { SubtaskService } from "../src/services/subtask.service";
import { ISubtaskRepository } from "../src/repositories/subtask.repository";
import { Subtask, SubtaskStatus } from "../src/models/subtask";

describe("SubtaskService", () => {
  let subtaskService: SubtaskService;
  let subtaskRepository: ISubtaskRepository;

  beforeEach(() => {
    subtaskRepository = {
      create: jest.fn(),
      get: jest.fn(),
      getByTodoId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    subtaskService = new SubtaskService(subtaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createSubtask", () => {
    it("should create a new subtask", async () => {
      const title = "Sample Subtask";
      const todoId = 1;

      const mockCreate = jest.spyOn(subtaskRepository, "create").mockImplementation(async (subtask: Subtask) => {
        subtask.id = 1;
        return subtask;
      });

      const createdSubtask = await subtaskService.createSubtask(title, todoId);

      expect(subtaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          todoId,
          title,
          status: SubtaskStatus.Pending,
          createdDate: expect.any(Date),
        })
      );

      expect(createdSubtask).toEqual({
        id: 1,
        title,
        todo_id: todoId,
        status: SubtaskStatus.Pending,
        created_at: expect.any(Date),
      });

      mockCreate.mockRestore();
    });
  });

  describe("updateSubtaskStatus", () => {
    it("should update the status of a subtask", async () => {
      const subtaskId = 1;
      const newStatus = SubtaskStatus.Completed;

      const mockGet = jest
        .spyOn(subtaskRepository, "get")
        .mockResolvedValue(new Subtask(1, "Sample Subtask", SubtaskStatus.Pending, new Date(), subtaskId));

      const mockUpdate = jest
        .spyOn(subtaskRepository, "update")
        .mockImplementation(async (subtask: Subtask) => subtask);

      const updatedSubtask = await subtaskService.updateSubtaskStatus(subtaskId, newStatus);

      expect(subtaskRepository.get).toHaveBeenCalledWith(subtaskId);

      expect(subtaskRepository.update).toHaveBeenCalledWith({
        id: subtaskId,
        title: "Sample Subtask",
        todoId: 1,
        status: newStatus,
        createdDate: expect.any(Date),
      });

      expect(updatedSubtask).toEqual({
        id: subtaskId,
        todo_id: 1,
        title: "Sample Subtask",
        status: newStatus,
        created_at: expect.any(Date),
      });

      mockGet.mockRestore();
      mockUpdate.mockRestore();
    });

    it("should throw an error if the subtask is not found", async () => {
      const subtaskId = 1;
      const newStatus = SubtaskStatus.Completed;

      jest.spyOn(subtaskRepository, "get").mockResolvedValue(null);

      await expect(subtaskService.updateSubtaskStatus(subtaskId, newStatus)).rejects.toThrowError("Subtask not found");

      expect(subtaskRepository.get).toHaveBeenCalledWith(subtaskId);

      expect(subtaskRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteSubtask", () => {
    it("should delete a subtask", async () => {
      const subtaskId = 1;

      const mockDelete = jest.spyOn(subtaskRepository, "delete").mockResolvedValue(true);

      const deleted = await subtaskService.deleteSubtask(subtaskId);

      expect(subtaskRepository.delete).toHaveBeenCalledWith(subtaskId);

      expect(deleted).toBe(true);

      mockDelete.mockRestore();
    });
  });
});
