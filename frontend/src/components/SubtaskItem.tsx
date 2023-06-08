import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Subtask, SubtaskStatus } from "../models/subtask";
import { updateSubtaskStatus } from "../services/subtaskService";
import { updateSubtaskStatus as updateStatusAction } from "../actions/subtaskAction";

export type SubtaskItemProps = {
  subtask: Subtask;
};

export const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask }: SubtaskItemProps) => {
  const [subtaskStatus, setSubtaskStatus] = useState<SubtaskStatus>(subtask.status);
  const dispatch = useDispatch();

  useEffect(() => {
    setSubtaskStatus(subtask.status);
  }, [subtask.status]);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newStatus = event.target.checked ? SubtaskStatus.Completed : SubtaskStatus.Pending;
      const updatedStatus = await updateSubtaskStatus(subtask.id!, newStatus);
      setSubtaskStatus(updatedStatus);
      dispatch(updateStatusAction(subtask.todoId, subtask.id!, updatedStatus));
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="margin-horizontal">
      <div className="item-container">
        <div className="item-center">
          <input type="checkbox" checked={subtaskStatus === SubtaskStatus.Completed} onChange={handleStatusChange} />
          <span className="item-title">{subtask.title}</span>
        </div>
      </div>
    </div>
  );
};
