import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddTodo } from "../components/AddTodo";
import { TodoItem } from "../components/TodoItem";
import { getAllTodo } from "../services/todoService";
import { RootState } from "../store";
import { initialTodos } from "../actions/todoAction";
import { ascendingTodoId } from "../utils/sorting";

export const TodoPage: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getAllTodo();
        const sortedTodos = todos.sort(ascendingTodoId);
        dispatch(initialTodos(sortedTodos));
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    fetchTodos();
  }, [dispatch]);

  return (
    <div className="todo-page-container">
      <div className="todo-page-header">Todo App</div>
      <div className="margin-vertical">
        <AddTodo />
      </div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
