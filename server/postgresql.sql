CREATE DATABASE mometum;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT '/uploads/default.png',
    total_xp INTEGER DEFAULT 0
);

CREATE TABLE todo (
    todo_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    goal_name VARCHAR(255),
    tasks JSONB DEFAULT '[]',
    completed_tasks INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    priority VARCHAR(50) DEFAULT 'low',
    deadline DATE
);