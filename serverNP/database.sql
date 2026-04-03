-- Just to be safe, let's make sure the table has the right structure
CREATE DATABASE mometum;

CREATE TABLE IF NOT EXISTS todo (
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    tasks JSONB DEFAULT '[]',
    completed_tasks INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    priority VARCHAR(50) DEFAULT 'low',
    deadline DATE
);