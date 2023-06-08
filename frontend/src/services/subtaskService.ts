import axios from "axios";
import { API_BASE_URL } from "./config";
import { Subtask, SubtaskResponse, SubtaskStatus } from "../models/subtask";
import { mapSubtask } from "../utils/mapper";

export const createSubtask = async (todo_id: number, title: string): Promise<Subtask> => {
  try {
    const response = await axios.post<SubtaskResponse>(`${API_BASE_URL}/subtask`, { todo_id, title });
    return mapSubtask(response.data);
  } catch (error) {
    console.error("Failed to create subtask:", error);
    throw new Error("Failed to create subtask");
  }
};

export const updateSubtaskStatus = async (id: number, status: string): Promise<SubtaskStatus> => {
  try {
    const response = await axios.put<SubtaskResponse>(`${API_BASE_URL}/subtask/${id}/status`, { status });

    const updatedStatus: SubtaskStatus = response.data.status;
    console.log("Subtask status updated successfully.");

    return updatedStatus;
  } catch (error) {
    console.error("Failed to update subtask status:", error);
    throw new Error("Failed to update subtask status");
  }
};
