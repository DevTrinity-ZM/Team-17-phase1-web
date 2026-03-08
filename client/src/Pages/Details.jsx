import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Details() {
	const { state } = useLocation();
	const [goal, setGoal] = useState(state);

	useEffect(() => {
		fetch("http://localhost:3001/goals/")
			.then(res => res.json())
			.then(goals => {
				setGoal(goals.find(g => g.id == state.id))
			})
			.catch(err => console.error(err))
	}, [])

	let date = new Date();
	date = date.toDateString();

	function handleEnter(e) {
		if (e.key == "Enter") {
			addTask(e.target.value);
			e.target.value = "";
		}
	}

	async function addTask(task) {
		let newTasks = [...goal.tasks, task];
		goal.tasks = newTasks;
		goal.totalTasks++;
		setGoal({...goal, "tasks": newTasks, "totalTasks": goal.tasks.length})

		try {
			await fetch(`http://localhost:3001/goals/${state.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(goal)
			});

		} catch (err) {
			console.log(err);
		}
	}


	return (
		<>
			<div className="date">{date}</div>
			<div className="card details">
				<div className="top-details">
					<h1 className="title">{goal.goalName}</h1>
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
					<p>Progress: {goal.totalTasks == 0 ? "0": (goal.completedTasks/goal.totalTasks) * 100}%</p>
					<p>Tasks Done: {goal.completedTasks}</p>
					<p>Tasks to do: {goal.totalTasks}</p>
					<p>XP: 0</p>
					<p>Priority: {goal.priority}</p>
				</div>
				<div className="card tasks">
					<h1 className="title">Tasks</h1>
					<div>
						{goal.tasks.map((n, index) => (
							<div className="task-container" key={index}>
								<div className="task">
									<div className="checkbox">
										<input type="checkbox" />
									</div>
									{n}
								</div>
								<div className="xp">5XP</div>
							</div>
						))}
						<div className="task-input">
							<input type="text" placeholder="Enter a task here..." onKeyDown={handleEnter}/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Details