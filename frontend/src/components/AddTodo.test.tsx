import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as reactRedux from "react-redux";
import * as todoService from "../services/todoService";
import { AddTodo } from "./AddTodo";
import { Todo, TodoStatus } from "../models/todo";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../services/todoService", () => ({
  createTodo: jest.fn(),
}));

describe("AddTodo component", () => {
  let useStateMock: ReturnType<typeof jest.spyOn>;
  let useDispatchMock: ReturnType<typeof jest.spyOn>;
  let createTodoMock: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    useStateMock = jest.spyOn(React, "useState");
    useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
    createTodoMock = jest.spyOn(todoService, "createTodo");
  });

  test("should dispatch addTodo action on button click", async () => {
    const todo: Todo = {
      id: 1,
      title: "New Subtask",
      status: TodoStatus.Pending,
      createdDate: new Date(),
      subtasks: [],
    };

    useStateMock.mockReturnValue(["", jest.fn()]);
    useDispatchMock.mockReturnValue(jest.fn());
    createTodoMock.mockResolvedValue(todo);

    const { getByPlaceholderText, getByText } = render(<AddTodo />);

    const inputElement = getByPlaceholderText("What to do?") as HTMLInputElement;
    const buttonElement = getByText("New List");

    const newTodoTitle = "Test Todo";

    fireEvent.change(inputElement, { target: { value: newTodoTitle } });
    fireEvent.click(buttonElement);

    expect(createTodoMock).toHaveBeenCalledWith(newTodoTitle);

    await waitFor(() => {
      expect(inputElement.value).toBe("");
    });
  });

  test("should not dispatch addTodo action if input is empty", () => {
    const { getByText } = render(<AddTodo />);

    const buttonElement = getByText("New List");

    fireEvent.click(buttonElement);

    expect(createTodoMock).not.toHaveBeenCalled();
  });
});
