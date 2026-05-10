const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
// not using .env i will change it when the we uplaod it online
const app = express();
const PORT = 3001;
const JWT_SECRET = "frabanda@@202520"; 

// SUPABASE 
const SUPABASE_URL = "https://rzdyychhqvfkyywndwcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_ymxSul_9tFWRBG0TZ6T8HQ_xgl1F72C"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//  uploads folder exists
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");


// Signup
app.post("/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into Supabase 'users' table
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, email, password: hashedPassword }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') return res.status(400).json("Email already exists");
            throw error;
        }

        res.status(201).json("User created successfully");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

//  Login
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(404).json("User not found");

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json("Invalid credentials");

        // Generate JWT Token
        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '24h' });

        // Send response
        res.json({
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Fetch all goals for a user
app.get("/goals/:userId", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('todo')
            .select(`id:todo_id, goalName:goal_name, tasks, completedTasks:completed_tasks, totalTasks:total_tasks, xp, priority, deadline`)
            .eq('user_id', req.params.userId)
            .order('todo_id', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

//  Add a new goal
app.post("/goals", async (req, res) => {
    try {
        const { goalName, tasks, completedTasks, totalTasks, xp, priority, deadline, userId } = req.body;
        const { data, error } = await supabase
            .from('todo')
            .insert([{ 
                goal_name: goalName, 
                tasks, 
                completed_tasks: completedTasks, 
                total_tasks: totalTasks, 
                xp, 
                priority, 
                deadline, 
                user_id: userId 
            }])
            .select('id:todo_id')
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json(err.message);
    }
});
// Upload Profile Picture
app.post("/auth/upload-profile/:userId", upload.single("profilePic"), async (req, res) => {
    try {
        const { userId } = req.params;
        const profilePicPath = `/uploads/${req.file.filename}`;

        const { error } = await supabase
            .from('users')
            .update({ profile_pic: profilePicPath })
            .eq('user_id', userId);

        if (error) throw error;
        res.json({ path: profilePicPath });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// DELETEProfile Picture to default
app.delete("/auth/profile-pic/:userId", async (req, res) => {
    try {
        const { error } = await supabase
            .from('users')
            .update({ profile_pic: '/uploads/default.png' })
            .eq('user_id', req.params.userId);

        if (error) throw error;
        res.json("Reset to default");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Update goal progress
app.patch("/goals/:id", async (req, res) => {
    try {
        const { tasks, completedTasks, totalTasks, xp } = req.body;
        const { error } = await supabase
            .from('todo')
            .update({ tasks, completed_tasks: completedTasks, total_tasks: totalTasks, xp })
            .eq('todo_id', req.params.id);

        if (error) throw error;
        res.json("OK");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

//  Remove a goal
app.delete("/goals/:id", async (req, res) => {
    try {
        const { error } = await supabase.from('todo').delete().eq('todo_id', req.params.id);
        if (error) throw error;
        res.json("Deleted");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));