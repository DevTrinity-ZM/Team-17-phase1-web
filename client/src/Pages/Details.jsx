import { useLocation } from "react-router-dom";
import { useState } from "react";

function Task() {
	return (
		<div className="task-container">
			<div className="task">
				<div className="checkbox">
					<input type="checkbox" />
				</div>
				This is a task
			</div>
			<div className="xp">5XP</div>
		</div>
	)
}

function Details() {
	let date = new Date();
	date = date.toDateString();
	const { state } = useLocation();
	const goalName = String(state.goalName);
	const priority = String(state.priority);
	const totalTasks = Number(state.totalTasks);
	const completedTasks = Number(state.completedTasks);

	async function addTask() {
		const [tasks, setTasks] = useState(state.tasks);
		setTasks([...tasks, "This is new text"]);
		try {
			await fetch(`http://localhost:3001/goals/${state.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(state.tasks)
			});
		} catch (err) {
			console.log("There i can't even reach");
		}
		console.log(state);
	}

	return (
		<>
			<div className="date">{date}</div>
			<div className="card details">
				<div className="top-details">
					<h1 className="title">{goalName}</h1>
					<button className="delete" onClick={async () => {
						await fetch(`http://localhost:3001/goals/${state.id}`, {
							method: "DELETE"
						});

						window.location.href = "/";
					}}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D67168"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
					</button>

				</div>
				
				<div className='progress-bar'>
					<div className="progress"></div>
				</div>
				<div className="goal-details">
					<p>Progress: {(completedTasks/totalTasks) * 100}%</p>
					<p>Tasks Done: {completedTasks}</p>
					<p>Tasks to do: {totalTasks}</p>
					<p>XP: 0</p>
					<p>Priority: {priority}</p>
				</div>
				<div className="card tasks">
					<h1 className="title">Tasks</h1>
					<Task />
					<button className='add task-btn' onClick={addTask}>+ Add Task</button>
				</div>
			</div>
		</>
	)
}

export default Details