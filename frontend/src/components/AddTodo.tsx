import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../services/todoService";
import { addTodo } from "../actions/todoAction";

export const AddTodo: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const dispatch = useDispatch();

  const handleNewTodoTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === "") {
      return;
    }

    const todo = await createTodo(newTodoTitle);

    dispatch(addTodo(todo));
    setNewTodoTitle("");
  };

  return (
    <div className="add-todo-container">
      <input
        className="add-todo-input"
        type="text"
        placeholder="What to do?"
        value={newTodoTitle}
        onChange={handleNewTodoTitleChange}
      />
      <button className="add-todo-button" onClick={handleAddTodo}>
        New List
      </button>
    </div>
  );
};
