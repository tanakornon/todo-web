import { ISubtaskRepository } from "../repositories/subtask.repository";
import { Subtask, SubtaskResponse, SubtaskStatus } from "../models/subtask";

export interface ISubtaskService {
  createSubtask: (title: string, todoId: number) => Promise<SubtaskResponse>;
  updateSubtaskStatus: (subtaskId: number, status: SubtaskStatus) => Promise<SubtaskResponse | null>;
  deleteSubtask: (subtaskId: number) => Promise<boolean>;
}

export class SubtaskService implements ISubtaskService {
  private subtaskRepository: ISubtaskRepository;

  constructor(subtaskRepository: ISubtaskRepository) {
    this.subtaskRepository = subtaskRepository;
  }

  createSubtask = async (title: string, todoId: number): Promise<SubtaskResponse> => {
    const subtask = new Subtask(todoId, title, SubtaskStatus.Pending, new Date());
    const createdSubtask = await this.subtaskRepository.create(subtask);
    return SubtaskResponse.fromSubtask(createdSubtask);
  };

  updateSubtaskStatus = async (subtaskId: number, status: SubtaskStatus): Promise<SubtaskResponse | null> => {
    const subtask = await this.subtaskRepository.get(subtaskId);
    if (!subtask) {
      throw new Error("Subtask not found");
    }

    subtask.status = status;
    const updatedSubtask = await this.subtaskRepository.update(subtask);
    return SubtaskResponse.fromSubtask(updatedSubtask);
  };

  deleteSubtask = async (subtaskId: number): Promise<boolean> => {
    const deleted = await this.subtaskRepository.delete(subtaskId);
    return deleted;
  };
}
