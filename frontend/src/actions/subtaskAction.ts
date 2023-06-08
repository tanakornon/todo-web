import { ADD_SUBTASK, UPDATE_SUBTASK_STATUS } from "../types/actions";
import { Subtask, SubtaskStatus } from "../models/subtask";

export const addSubtask = (todoId: number, subtask: Subtask) => ({
  type: ADD_SUBTASK,
  payload: {
    todoId,
    subtask,
  },
});

export const updateSubtaskStatus = (todoId: number, subtaskId: number, status: SubtaskStatus) => ({
  type: UPDATE_SUBTASK_STATUS,
  payload: {
    todoId,
    subtaskId,
    status,
  },
});
