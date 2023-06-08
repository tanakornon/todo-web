import { PostgresClient } from "../infrastructures/postgres";
import { Subtask } from "../models/subtask";

export interface ISubtaskRepository {
  create(subtask: Subtask): Promise<Subtask>;
  get(id: number): Promise<Subtask | null>;
  getByTodoId(todoId: number): Promise<Subtask[]>;
  update(subtask: Subtask): Promise<Subtask>;
  delete(subtaskId: number): Promise<boolean>;
}

export class SubtaskRepository implements ISubtaskRepository {
  private client: PostgresClient;

  constructor(client: PostgresClient) {
    this.client = client;
  }

  createTableIfNotExists = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS subtask (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_date TIMESTAMP NOT NULL,
        todo_id INTEGER REFERENCES todo(id)
      )
    `;

    await this.client.query(createTableQuery);
  };

  create = async (subtask: Subtask): Promise<Subtask> => {
    const values = [subtask.title, subtask.status, subtask.createdDate, subtask.todoId];
    const query = `
      INSERT INTO subtask (title, status, created_date, todo_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const queryResult = await this.client.query(query, values);
    const result = Subtask.fromSubtaskRow(queryResult.rows[0]);
    return result;
  };

  get = async (id: number): Promise<Subtask | null> => {
    const values = [id];
    const query = "SELECT * FROM subtask WHERE id = $1";

    const queryResult = await this.client.query(query, values);

    if (queryResult.rows.length === 0) {
      return null;
    }

    const result = Subtask.fromSubtaskRow(queryResult.rows[0]);
    return result;
  };

  getByTodoId = async (todoId: number): Promise<Subtask[]> => {
    const values = [todoId];
    const query = "SELECT * FROM subtask WHERE todo_id = $1";

    const queryResult = await this.client.query(query, values);
    const result = queryResult.rows.map((row) => Subtask.fromSubtaskRow(row));
    return result;
  };

  update = async (subtask: Subtask): Promise<Subtask> => {
    const values = [subtask.title, subtask.status, subtask.createdDate, subtask.todoId, subtask.id];
    const query = `
      UPDATE subtask
      SET title = $1, status = $2, created_date = $3, todo_id = $4
      WHERE id = $5
      RETURNING *
    `;

    const queryResult = await this.client.query(query, values);
    const result = Subtask.fromSubtaskRow(queryResult.rows[0]);
    return result;
  };

  delete = async (subtaskId: number): Promise<boolean> => {
    const query = "DELETE FROM subtask WHERE id = $1";
    const queryResult = await this.client.query(query, [subtaskId]);
    return queryResult.rowCount > 0;
  };
}
