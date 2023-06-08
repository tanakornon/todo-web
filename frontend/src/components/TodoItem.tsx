import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Todo, TodoStatus } from "../models/todo";
import { SubtaskStatus } from "../models/subtask";
import { updateTodoStatus } from "../services/todoService";
import { ascendingSubtaskId } from "../utils/sorting";
import { AddSubtask } from "./AddSubtask";
import { SubtaskItem } from "./SubtaskItem";
import { updateSubtaskStatus } from "../services/subtaskService";
import { updateSubtaskStatus as updateStatusAction } from "../actions/subtaskAction";
import { useDispatch } from "react-redux";

export type TodoItemProps = {
  todo: Todo;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo }: TodoItemProps) => {
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(todo.status);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [completedSubtasksCount, setCompletedSubtasksCount] = useState<number>(
    todo.subtasks.filter((subtask) => subtask.status === SubtaskStatus.Completed).length
  );

  const totalSubtasksCount = todo.subtasks.length;

  useEffect(() => {
    const completed = todo.subtasks.filter((subtask) => subtask.status === SubtaskStatus.Completed).length;
    setTodoStatus(completed && completed === todo.subtasks.length ? TodoStatus.Completed : TodoStatus.Pending);
    setCompletedSubtasksCount(completed);
  }, [todo.subtasks]);

  const handleTodoStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newStatus = event.target.checked ? TodoStatus.Completed : TodoStatus.Pending;
      const updatedStatus = await updateTodoStatus(todo.id!, newStatus);
      setTodoStatus(updatedStatus);
      // not optimal
      await Promise.all([
        todo.subtasks.map((subtask) => {
          dispatch(
            updateStatusAction(
              todo.id!,
              subtask.id!,
              newStatus === TodoStatus.Completed ? SubtaskStatus.Completed : SubtaskStatus.Pending
            )
          );
          return updateSubtaskStatus(subtask.id!, newStatus);
        }),
      ]);
    } catch (err) {
      // Handle error
    }
  };

  const handleDropdownChange = () => {
    setDropdownState(!dropdownState);
  };

  const renderDropdown = () => {
    if (!dropdownState) return <></>;

    return (
      <>
        {todo.subtasks.sort(ascendingSubtaskId).map((subtask) => (
          <SubtaskItem key={subtask.id} subtask={subtask} />
        ))}
        <AddSubtask key={todo.id} todoId={todo.id!} />
      </>
    );
  };
  return (
    <>
      <div className="item-container">
        <div className="item-center">
          <input type="checkbox" checked={todoStatus === TodoStatus.Completed} onChange={handleTodoStatusChange} />
          <span className="item-title">{todo.title}</span>
          <div className="item-dropdown" onClick={handleDropdownChange}>
            {`${completedSubtasksCount} of ${totalSubtasksCount} completed`}
            <FontAwesomeIcon className="margin-left" icon={dropdownState ? faAngleDown : faAngleUp} />
          </div>
        </div>
      </div>
      {renderDropdown()}
    </>
  );
};
