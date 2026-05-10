
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT '/uploads/default.png',
    total_xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todo (
    todo_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    goal_name VARCHAR(255) NOT NULL,
    tasks JSONB DEFAULT '[]'::jsonb,
    completed_tasks INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    priority VARCHAR(50) DEFAULT 'medium',
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.completed_tasks >= NEW.total_tasks AND OLD.completed_tasks < OLD.total_tasks THEN
        UPDATE users 
        SET total_xp = total_xp + NEW.xp 
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_goal_completed ON todo;
CREATE TRIGGER on_goal_completed
AFTER UPDATE ON todo
FOR EACH ROW
EXECUTE FUNCTION update_user_xp();

DROP POLICY IF EXISTS "Enable all for users" ON users;
DROP POLICY IF EXISTS "Enable all for todo" ON todo;
DROP POLICY IF EXISTS "Allow signup" ON users;
DROP POLICY IF EXISTS "Allow login" ON users;

CREATE POLICY "Enable all for users" 
ON users FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable all for todo" 
ON todo FOR ALL 
USING (true) 
WITH CHECK (true);