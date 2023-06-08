# Setup Postgres

### pull docker image

```
docker pull postgres
```

### run container

```
docker run --name postgres -e POSTGRES_USER=todo -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```

### create database

```
docker exec -it postgres psql -U todo -c "CREATE DATABASE tododb;"
```

### create tables

```
docker exec -it postgres psql -U todo -d tododb -c "
    -- Create the 'todo' table
    CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_date TIMESTAMP NOT NULL
    );

    -- Create the 'subtask' table
    CREATE TABLE IF NOT EXISTS subtask (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_date TIMESTAMP NOT NULL,
        todo_id INTEGER REFERENCES todo(id)
    );
"
```

### seed data

```
docker exec -it postgres psql -U todo -d tododb -c "
    -- Insert seed data into the 'todo' table
    INSERT INTO todo (title, status, created_date)
    VALUES  ('Task 1', 'Pending', NOW()),
            ('Task 2', 'Completed', NOW()),
            ('Task 3', 'Pending', NOW());

    -- Insert seed data into the 'subtask' table
    INSERT INTO subtask (title, status, created_date, todo_id)
    VALUES  ('Subtask 1', 'Pending', NOW(), 1),
            ('Subtask 2', 'Completed', NOW(), 1),
            ('Subtask 3', 'Pending', NOW(), 2);
"
```

# Start the Project

### npm install frontend and backend

```
npm run setup
```

### start frontend (:3000) and backend (:3333)

```
npm run start
```

### test

```
npm run test
```

### cleanup

```
npm run clean
```
