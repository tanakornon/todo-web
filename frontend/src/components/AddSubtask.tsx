import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createSubtask } from "../services/subtaskService";
import { addSubtask } from "../actions/subtaskAction";

export type AddSubtaskProps = {
  todoId: number;
};

export const AddSubtask: React.FC<AddSubtaskProps> = ({ todoId }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const dispatch = useDispatch();

  const handleNewSubtaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubtaskTitle(event.target.value);
  };

  const handleAddSubtask = async () => {
    if (newSubtaskTitle.trim() === "") {
      return;
    }

    const subtask = await createSubtask(todoId, newSubtaskTitle);

    dispatch(addSubtask(subtask.todoId, subtask));
    setNewSubtaskTitle("");
  };

  return (
    <div className="margin-horizontal">
      <div className="item-container">
        <div className="item-center">
          <input
            className="add-subtask-input"
            type="text"
            placeholder="What are the steps?"
            value={newSubtaskTitle}
            onChange={handleNewSubtaskTitleChange}
          />
          <button className="add-subtask-button" onClick={handleAddSubtask}>
            New Step
          </button>
        </div>
      </div>
    </div>
  );
};
