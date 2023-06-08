import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as subtaskService from "../services/subtaskService";
import { AddSubtask } from "./AddSubtask";
import { Subtask, SubtaskStatus } from "../models/subtask";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../services/subtaskService", () => ({
  createSubtask: jest.fn(),
}));

describe("AddSubtask component", () => {
  let useStateMock: ReturnType<typeof jest.spyOn>;
  let useDispatchMock: ReturnType<typeof jest.spyOn>;
  let createSubtaskMock: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    useStateMock = jest.spyOn(React, "useState");
    useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
    createSubtaskMock = jest.spyOn(subtaskService, "createSubtask");
  });

  test("should dispatch addSubtask action on button click", async () => {
    const todoId = 1;
    const subtask: Subtask = {
      id: 1,
      todoId,
      title: "New Subtask",
      status: SubtaskStatus.Pending,
      createdDate: new Date(),
    };

    useStateMock.mockReturnValue(["", jest.fn()]);
    useDispatchMock.mockReturnValue(jest.fn());
    createSubtaskMock.mockResolvedValue(subtask);

    const { getByPlaceholderText, getByText } = render(<AddSubtask todoId={todoId} />);

    const inputElement = getByPlaceholderText("What are the steps?") as HTMLInputElement;
    const buttonElement = getByText("New Step");

    const newSubtaskTitle = "Test Subtask";

    fireEvent.change(inputElement, { target: { value: newSubtaskTitle } });
    fireEvent.click(buttonElement);

    expect(createSubtaskMock).toHaveBeenCalledWith(todoId, newSubtaskTitle);

    await waitFor(() => {
      expect(inputElement.value).toBe("");
    });
  });

  test("should not dispatch addSubtask action if input is empty", () => {
    const todoId = 1;

    const { getByText } = render(<AddSubtask todoId={todoId} />);

    const buttonElement = getByText("New Step");

    fireEvent.click(buttonElement);

    expect(createSubtaskMock).not.toHaveBeenCalled();
  });
});
