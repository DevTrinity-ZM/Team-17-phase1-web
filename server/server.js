const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const JWT_SECRET = "momentum_secret_123";

// signup

app.post("/auth/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userCheck.rows.length > 0) return res.status(400).json("User exists");

        const hash = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password, profile_pic) VALUES($1, $2, $3, $4) RETURNING *",
            [username, email, hash, '/uploads/default.png']
        );
        res.json(newUser.rows[0]);
    } catch (err) { res.status(500).json(err.message); }
});


//login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(401).json("Invalid email");
        
        const valid = await bcrypt.compare(password, user.rows[0].password);
        if (!valid) return res.status(401).json("Invalid password");

        const token = jwt.sign({ id: user.rows[0].user_id }, JWT_SECRET, { expiresIn: '24h' });
        const { password: _, ...userWithoutPassword } = user.rows[0];
        res.json({ token, user: userWithoutPassword });
    } catch (err) { res.status(500).json(err.message); }
});





// Fetch goals for specific user 
app.get("/goals/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const all = await pool.query(
            `SELECT todo_id as id, goal_name as "goalName", tasks, 
            completed_tasks as "completedTasks", total_tasks as "totalTasks", 
            xp, priority, deadline FROM todo WHERE user_id = $1 ORDER BY todo_id DESC`,
            [userId]
        );
        res.json(all.rows);
    } catch (err) { res.status(500).json(err.message); }
});

//  Save new goal 
app.post("/goals", async (req, res) => {
    try {
        const { goalName, tasks, completedTasks, totalTasks, xp, priority, deadline, userId } = req.body;
        const newG = await pool.query(
            "INSERT INTO todo (goal_name, tasks, completed_tasks, total_tasks, xp, priority, deadline, user_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING todo_id as id",
            [goalName, JSON.stringify(tasks), completedTasks, totalTasks, xp, priority, deadline, userId]
        );
        res.json(newG.rows[0]);
    } catch (err) { res.status(500).json(err.message); }
});

//Update tasks and XP 
app.patch("/goals/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { tasks, completedTasks, totalTasks, xp } = req.body;
        await pool.query(
            "UPDATE todo SET tasks=$1, completed_tasks=$2, total_tasks=$3, xp=$4 WHERE todo_id=$5", 
            [JSON.stringify(tasks), completedTasks, totalTasks || 0, xp || 0, id]
        );
        res.json("OK");
    } catch (err) { res.status(500).json(err.message); }
});





//  Goal Completion 
app.post("/goals/:id/complete", async (req, res) => {
    try {
        const { id } = req.params;
        
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Goal archived");
    } catch (err) { res.status(500).json(err.message); }
});

//  Delete 
app.delete("/goals/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [req.params.id]);
        res.json("Deleted");
    } catch (err) { res.status(500).json(err.message); }
});




// PROFILE 

app.post("/auth/upload-profile", upload.single('profilePic'), async (req, res) => {
    try {
        const { userId } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;
        await pool.query("UPDATE users SET profile_pic = $1 WHERE user_id = $2", [imageUrl, userId]);
        res.json({ imageUrl });
    } catch (err) { res.status(500).json(err.message); }
});

app.listen(3001, () => console.log("Server running on port 3001"));
