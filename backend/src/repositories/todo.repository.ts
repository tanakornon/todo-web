import { PostgresClient } from "../infrastructures/postgres";
import { Todo } from "../models/todo";

export interface ITodoRepository {
  create(todo: Todo): Promise<Todo>;
  get(todoId: number): Promise<Todo | null>;
  getAll(): Promise<Todo[]>;
  update(todo: Todo): Promise<Todo>;
  delete(todoId: number): Promise<boolean>;
}

export class TodoRepository implements ITodoRepository {
  private client: PostgresClient;

  constructor(client: PostgresClient) {
    this.client = client;
  }

  createTableIfNotExists = async (): Promise<void> => {
    const createTableQuery = `
			CREATE TABLE IF NOT EXISTS todo (
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				status VARCHAR(20) NOT NULL,
				created_date TIMESTAMP NOT NULL
			)
    `;

    await this.client.query(createTableQuery);
  };

  create = async (todo: Todo): Promise<Todo> => {
    const values = [todo.title, todo.status, todo.createdDate];
    const query = "INSERT INTO todo (title, status, created_date) VALUES ($1, $2, $3) RETURNING *";

    const queryResult = await this.client.query(query, values);
    const result = Todo.fromTodoRow(queryResult.rows[0]);
    return result;
  };

  get = async (todoId: number): Promise<Todo | null> => {
    const values = [todoId];
    const query = "SELECT * FROM todo WHERE id = $1";

    const queryResult = await this.client.query(query, values);

    if (queryResult.rows.length === 0) {
      return null;
    }

    const result = Todo.fromTodoRow(queryResult.rows[0]);
    return result;
  };

  getAll = async (): Promise<Todo[]> => {
    const query = "SELECT * FROM todo";

    const queryResult = await this.client.query(query);
    const result = queryResult.rows.map((row) => Todo.fromTodoRow(row));
    return result;
  };

  update = async (todo: Todo): Promise<Todo> => {
    const values = [todo.title, todo.status, todo.createdDate, todo.id];
    const query = "UPDATE todo SET title = $1, status = $2, created_date = $3 WHERE id = $4 RETURNING *";

    const queryResult = await this.client.query(query, values);
    const result = Todo.fromTodoRow(queryResult.rows[0]);
    return result;
  };

  delete = async (todoId: number): Promise<boolean> => {
    const values = [todoId];
    const query = "DELETE FROM todo WHERE id = $1";

    const queryResult = await this.client.query(query, values);
    return queryResult.rowCount > 0;
  };
}
