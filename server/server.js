import express from "express";
import { readFileSync, writeFileSync } from "fs";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

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

//this is to add a new task to the goals in goals.json, it's not for general updates
app.patch("/goals/:id", (req, res) => {
	try {
		const data = readFileSync("goals.json", "utf-8");
		let goals = JSON.parse(data);

		const goal = goals.find(g => g.id == req.params.id);

		if (!goal) {
			return res.status(404).json({ error: "Goal not found" });
		}

		goal.tasks = req.body;

		writeFileSync("goals.json", JSON.stringify(goals, null, 2));

		res.json({ message: "Task added" });
	} catch (err) {
		console.error("PATCH ERROR:", err);
		res.status(500).json({ error: "Write failed" });
	}
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running on port 3001");
});