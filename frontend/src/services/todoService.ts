import axios from "axios";
import { API_BASE_URL } from "./config";
import { Todo, TodoResponse, TodoStatus } from "../models/todo";
import { mapTodo } from "../utils/mapper";

export const getAllTodo = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get<TodoResponse[]>(`${API_BASE_URL}/todo`);
    return response.data.map(mapTodo);
  } catch (error) {
    console.error("Failed to fetch todo:", error);
    throw new Error("Failed to fetch todo");
  }
};

export const createTodo = async (title: string): Promise<Todo> => {
  try {
    const response = await axios.post<TodoResponse>(`${API_BASE_URL}/todo`, { title });
    return mapTodo(response.data);
  } catch (error) {
    console.error("Failed to fetch todo:", error);
    throw new Error("Failed to fetch todo");
  }
};

export const updateTodoStatus = async (id: number, status: string): Promise<TodoStatus> => {
  try {
    const response = await axios.put<TodoResponse>(`${API_BASE_URL}/todo/${id}/status`, { status });

    const updatedStatus: TodoStatus = response.data.status;
    console.log("Todo status updated successfully.");

    return updatedStatus;
  } catch (error) {
    console.error("Failed to update todo status:", error);
    throw new Error("Failed to update todo status");
  }
};
