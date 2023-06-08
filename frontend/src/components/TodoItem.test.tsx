import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as todoService from "../services/todoService";
import { TodoItem } from "./TodoItem";
import { Todo, TodoStatus } from "../models/todo";
import { SubtaskStatus } from "../models/subtask";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../services/todoService", () => ({
  updateTodoStatus: jest.fn(),
}));

describe("TodoItem component", () => {
  let useStateMock: ReturnType<typeof jest.spyOn>;
  let useDispatchMock: ReturnType<typeof jest.spyOn>;
  let updateTodoStatusMock: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    useStateMock = jest.spyOn(React, "useState");
    useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
    updateTodoStatusMock = jest.spyOn(todoService, "updateTodoStatus");
  });

  test("should update todo status on checkbox change", async () => {
    const todo: Todo = {
      id: 1,
      title: "Test Todo",
      status: TodoStatus.Pending,
      createdDate: new Date(),
      subtasks: [],
    };

    useStateMock.mockReturnValue([TodoStatus.Pending, jest.fn()]);
    useDispatchMock.mockReturnValue(jest.fn());
    updateTodoStatusMock.mockResolvedValue(TodoStatus.Completed);

    const { getByRole } = render(<TodoItem todo={todo} />);
    const checkboxElement = getByRole("checkbox") as HTMLInputElement;

    await act(async () => {
      fireEvent.click(checkboxElement);
    });

    expect(updateTodoStatusMock).toHaveBeenCalledWith(todo.id, TodoStatus.Completed);
  });

  test("should render correct subtask completion count", () => {
    const todo: Todo = {
      id: 1,
      title: "Test Todo",
      status: TodoStatus.Pending,
      createdDate: new Date(),
      subtasks: [
        { id: 1, todoId: 1, title: "Subtask 1", status: SubtaskStatus.Completed, createdDate: new Date() },
        { id: 2, todoId: 1, title: "Subtask 2", status: SubtaskStatus.Pending, createdDate: new Date() },
      ],
    };

    useStateMock.mockReturnValueOnce([TodoStatus.Pending, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);

    const { getByText } = render(<TodoItem todo={todo} />);
    const completionCountElement = getByText("1 of 2 completed");

    expect(completionCountElement).toBeInTheDocument();
  });

  test("should toggle dropdown state on click", () => {
    const todo: Todo = {
      id: 1,
      title: "Test Todo",
      status: TodoStatus.Pending,
      createdDate: new Date(),
      subtasks: [],
    };

    useStateMock.mockReturnValueOnce([TodoStatus.Pending, jest.fn()]);
    useStateMock.mockReturnValueOnce([false, jest.fn()]);

    const { getByText } = render(<TodoItem todo={todo} />);
    const dropdownElement = getByText("0 of 0 completed");

    fireEvent.click(dropdownElement);

    const updatedDropdownElement = getByText("0 of 0 completed");

    expect(updatedDropdownElement).toBeInTheDocument();
  });
});
