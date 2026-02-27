import { useLocation } from "react-router-dom";


function Details() {
	let date = new Date();
	date = date.toDateString();
	const { state } = useLocation();
	const goalName = String(state.goalName);
	const priority = String(state.priority);


	return (
		<>
			<div className="date">{date}</div>
			<div className="card details">
				<h1 className="title">{goalName}</h1>
				<div className='progress-bar'>
					<div className="progress"></div>
				</div>
				<div className="goal-details">
					<p>Progress: </p>
					<p>Tasks Done: </p>
					<p>XP: </p>
					<p>Priority: {priority}</p>
				</div>

				<button onClick={async () => {
					await fetch(`http://localhost:3001/goals/${state.id}`, {
						method: "DELETE"
					});

					window.location.href = "/";
				}}>Delete</button>
			</div>
		</>
	)
}

export default Details