import { Request, Response } from "express";
import { ISubtaskService } from "../services/subtask.service";
import { SubtaskStatus } from "../models/subtask";

export class SubtaskController {
  private subtaskService: ISubtaskService;

  constructor(subtaskService: ISubtaskService) {
    this.subtaskService = subtaskService;
  }

  createSubtask = async (req: Request, res: Response): Promise<void> => {
    const { title, todo_id } = req.body;

    if (!title || !todo_id) {
      res.status(400).json({ error: "Missing required attributes: title, todo_id" });
      return;
    }

    try {
      const createdSubtask = await this.subtaskService.createSubtask(title, todo_id);
      res.status(201).json(createdSubtask);
    } catch (error) {
      console.error("Error creating subtask:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateSubtaskStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Missing required attribute: status" });
      return;
    }

    if (!Object.values(SubtaskStatus).includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }

      const updatedSubtask = await this.subtaskService.updateSubtaskStatus(parsedId, status);
      res.json(updatedSubtask);
    } catch (error) {
      console.error("Error updating subtask:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
