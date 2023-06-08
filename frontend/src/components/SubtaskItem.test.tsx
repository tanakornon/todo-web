import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as subtaskService from "../services/subtaskService";
import { SubtaskItem } from "./SubtaskItem";
import { Subtask, SubtaskStatus } from "../models/subtask";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../services/subtaskService", () => ({
  updateSubtaskStatus: jest.fn(),
}));

describe("SubtaskItem component", () => {
  let useStateMock: ReturnType<typeof jest.spyOn>;
  let useDispatchMock: ReturnType<typeof jest.spyOn>;
  let updateSubtaskStatusMock: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    useStateMock = jest.spyOn(React, "useState");
    useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
    updateSubtaskStatusMock = jest.spyOn(subtaskService, "updateSubtaskStatus");
  });

  test("should update subtask status on checkbox change", async () => {
    const subtask: Subtask = {
      id: 1,
      todoId: 1,
      title: "Subtask 1",
      status: SubtaskStatus.Pending,
      createdDate: new Date(),
    };

    useStateMock.mockReturnValue([SubtaskStatus.Pending, jest.fn()]);
    useDispatchMock.mockReturnValue(jest.fn());
    updateSubtaskStatusMock.mockResolvedValue(subtask);

    const { getByRole } = render(<SubtaskItem subtask={subtask} />);
    const checkboxElement = getByRole("checkbox") as HTMLInputElement;

    await act(async () => {
      fireEvent.click(checkboxElement);
    });

    expect(updateSubtaskStatusMock).toHaveBeenCalledWith(subtask.id, SubtaskStatus.Completed);
  });

  test("should update subtask status to pending on checkbox change", async () => {
    const subtask: Subtask = {
      id: 1,
      todoId: 1,
      title: "Subtask 1",
      status: SubtaskStatus.Completed,
      createdDate: new Date(),
    };

    useStateMock.mockReturnValue([SubtaskStatus.Completed, jest.fn()]);
    useDispatchMock.mockReturnValue(jest.fn());
    updateSubtaskStatusMock.mockResolvedValue(subtask);

    const { getByRole } = render(<SubtaskItem subtask={subtask} />);
    const checkboxElement = getByRole("checkbox") as HTMLInputElement;

    await act(async () => {
      fireEvent.click(checkboxElement);
    });

    expect(updateSubtaskStatusMock).toHaveBeenCalledWith(subtask.id, SubtaskStatus.Pending);
  });
});
