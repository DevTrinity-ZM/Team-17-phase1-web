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

	async function updateGoal(newGoal) {
		try {
			await fetch(`http://localhost:3001/goals/${state.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newGoal)
			});
		} catch (err) {
			console.log(err);
		}
	}

	let date = new Date();
	date = date.toDateString();

	function handleEnter(e) {
		if (e.key == "Enter") {
			addTask(e.target.value);
			e.target.value = "";
		}
	}
	async function check(e) {
		let taskID = Number(e.target.id);

		setGoal(prevGoal => {
			const updatedGoal = {...prevGoal,
				"tasks": prevGoal.tasks.map(task =>
					task.id === taskID ? 
						{ ...task, completed: !task.completed }
						: task
				)
			};

			updateGoal(updatedGoal);
			return updatedGoal;
		});

		setGoal(prevGoal => {
			const updatedGoal = {...prevGoal,
				"completedTasks": prevGoal.tasks.filter(t => t.completed).length,
			};

			updateGoal(updatedGoal);
			return updatedGoal;
		});

		setGoal(prevGoal => {
			const updatedGoal = {...prevGoal,
				"xp": prevGoal.completedTasks * 5,
			};

			updateGoal(updatedGoal);
			return updatedGoal;
		});

	}

	async function addTask(task) {
		let taskObj = { id: goal.tasks.length, text: task, completed: false};
		let newTasks = [...goal.tasks, taskObj];
		goal.tasks = newTasks;
		goal.totalTasks++;
		setGoal({...goal, "tasks": newTasks, "totalTasks": goal.tasks.length})
		updateGoal(goal);
	}

	async function completeGoal() {
		if (goal.completedTasks == goal.totalTasks) {
			await fetch(`http://localhost:3001/goals/${state.id}/complete`, { 
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(goal)
			});

			window.location.href = "/";
		} else {
			alert("You must complete all tasks first")
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
					<div className="progress" style={{width: `${goal.totalTasks == 0 ? "0": (goal.completedTasks/goal.totalTasks) * 100}%`}}></div>
				</div>
				<div className="goal-details">
					<p>Progress: {goal.totalTasks == 0 ? "0": (goal.completedTasks/goal.totalTasks) * 100}%</p>
					<p>Tasks Done: {goal.completedTasks}</p>
					<p>Tasks to do: {goal.totalTasks}</p>
					<p>XP: {goal.xp}</p>
					<p>Priority: {goal.priority}</p>
				</div>
				<div className="card tasks">
					<h1 className="title">Tasks</h1>
					<div>
						{goal.tasks.map((n, index) => (
							<div className="task-container" key={index}>
								<label className="checkbox-container">
									<input type="checkbox" onChange={check} id={index} checked={n.completed ? true : false} />
									<span className="checkmark"></span>
									<p>{n.text}</p>
								</label>
								<div className="xp">5XP</div>
							</div>
						))}
						<div className="task-input">
							<input type="text" placeholder="Enter a task here..." onKeyDown={handleEnter}/>
						</div>
					</div>
				</div>
				<button className="add" onClick={completeGoal}>Goal Completed ✔</button>
			</div>
		</>
	)
}

export default Details