import express from "express";
import { readFileSync, writeFileSync } from "fs";
import cors from "cors";
import { json } from "stream/consumers";
import { error } from "console";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/goals/completed", (req, res) => {
    const data = readFileSync("completedGoals.json", "utf-8");
    res.json(JSON.parse(data));
});

app.get("/goals", (req, res) => {
  	const data = readFileSync("goals.json", "utf-8");
  	res.json(JSON.parse(data));
});

app.post("/goals", (req, res) => {
	const data = readFileSync("goals.json", "utf-8");
	const goals = JSON.parse(data);

	goals.push(req.body);

	writeFileSync("goals.json", JSON.stringify(goals, null, 2));

	res.json({ message: "Goal added" });
});

app.delete("/goals/:id", (req, res) => {
	const data = readFileSync("goals.json", "utf-8");
	let goals = JSON.parse(data);

	goals = goals.filter(goal => goal.id != req.params.id);

	writeFileSync("goals.json", JSON.stringify(goals, null, 2));

	res.json({ message: "Deleted" });
});

app.patch("/goals/:id", (req, res) => {
	try {
		const data = readFileSync("goals.json", "utf-8");
		let goals = JSON.parse(data);

		let goal = goals.find(g => g.id == req.params.id);

		if (!goal) {
			return res.status(404).json({ error: "Goal not found" });
		}

		goal.totalTasks = req.body.totalTasks;
		goal.tasks = req.body.tasks;
		goal.completedTasks = req.body.completedTasks;
		goal.xp = req.body.xp;

		writeFileSync("goals.json", JSON.stringify(goals, null, 2));

		res.json({ message: "Goal Updated" });
	} catch (err) {
		console.error("PATCH ERROR:", err);
		res.status(500).json({ error: "Write failed" });
	}
});

//for completed goals
app.post("/goals/:id/complete", (req, res) => {
	try {
        const goalsData = readFileSync("goals.json", "utf-8");
        let goals = JSON.parse(goalsData);

		const completedData = readFileSync("completedGoals.json", "utf-8");
		let completedGoals = JSON.parse(completedData);

		const goal = goals.find(g => g.id == req.params.id);
        if (!goal) {
            return res.status(404).json({ error: "Goal not found" });
        }

        completedGoals.push({ ...goal, completedAt: new Date().toISOString() });
        goals = goals.filter(g => g.id != req.params.id);

		writeFileSync("goals.json", JSON.stringify(goals, null, 2));
        writeFileSync("completedGoals.json", JSON.stringify(completedGoals, null, 2));

		res.json({ message: "Goal completed" });
	} catch(err) {
		console.error("COMPLETION ERROR: ", err);
		res.status(500).json({error: "Could not complete goal"});
	}
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running on port 3001");
});