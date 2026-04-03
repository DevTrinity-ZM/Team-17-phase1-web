const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

// 1. CREATE A GOAL
app.post("/todos", async (req, res) => {
    try {
        // We pull everything from the request body
        const { 
            goalName, 
            description, 
            tasks, 
            completedTasks, 
            totalTasks, 
            xp, 
            priority, 
            deadline 
        } = req.body;

        // Fallback: Use goalName if description is missing, and vice versa
        const finalDescription = description || goalName || "Untitled Goal";

        const newTodo = await pool.query(
            `INSERT INTO todo (
                description, 
                tasks, 
                completed_tasks, 
                total_tasks, 
                xp, 
                priority, 
                deadline
            ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                finalDescription,
                JSON.stringify(tasks || []),
                completedTasks || 0,
                totalTasks || 0,
                xp || 0,
                priority || 'low',
                deadline || null
            ]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error("POST Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL GOALS
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id ASC");
        res.json(allTodos.rows);
    } catch (err) {
        console.error("GET Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// 3. UPDATE A GOAL (The most important one for checkmarks/XP)
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description, tasks, completed_tasks, total_tasks, xp, priority, deadline } = req.body;

        await pool.query(
            `UPDATE todo SET 
                description = $1, 
                tasks = $2, 
                completed_tasks = $3, 
                total_tasks = $4, 
                xp = $5, 
                priority = $6, 
                deadline = $7 
             WHERE todo_id = $8`,
            [
                description, 
                JSON.stringify(tasks), 
                completed_tasks, 
                total_tasks, 
                xp, 
                priority, 
                deadline, 
                id
            ]
        );
        res.json("Update successful!");
    } catch (err) {
        console.error("PUT Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE A GOAL
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Deleted!");
    } catch (err) {
        console.error("DELETE Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(4000, () => console.log("Server running on port 4000"));