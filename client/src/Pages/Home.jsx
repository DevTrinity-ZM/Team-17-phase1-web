import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//id in this case is used for styling, title is for the card, children is the card contents
//tag is the button on the top right of the card, where available
//metrics is only for the METRICS card
function Card({ className, title, children, tag=''}) {
	return (
		<div className={`card ${className}`}>
			<div className='top'>
				<h1 className='card-title'>{title}</h1>
				{tag && <button>[{tag}]</button>}
			</div>

			{children}
		</div>
	)
}

function Home() {
	const [showPopup, setShowPopup] = useState(false);
	const [goals, setGoals] = useState([]);
	
	useEffect(() => {
		fetch("http://localhost:3001/goals")
			.then(res => res.json())
			.then(data => setGoals(data))
			.catch(err => console.error(err));
	}, []);

	async function addGoal(goalData) {
		try {
			await fetch("http://localhost:3001/goals", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(goalData)
			});

			const res = await fetch("http://localhost:3001/goals");
			const updated = await res.json();
			setGoals(updated);

			setShowPopup(false);
			window.location.reload()
		} catch (err) {
			console.error(err);
		}
	}
		
	function GoalPopup() {
		//date
		const today = new Date().toISOString().split('T')[0];

		//for goal information input
		const [goalName, setGoalName] = useState('');
		const [deadline, setDeadline] = useState('');

		const handleSubmit = () => {
			let now = new Date();
			now.setHours(0, 0, 0, 0);
			let end = new Date(deadline);
			end.setHours(0, 0, 0, 0);
			const days_left = Math.ceil(
				(end - now) / (1000 * 60 * 60 * 24)
			);

			const goal = {
				id: Date.now(),
				goalName: goalName,
				deadline: deadline,
				daysLeft: days_left,
				streak: 0,
				totalTasks: 0,
				completedTasks: 0,
				xp: 0,
				priority: "low",
				tasks: []
			};

			if(goalName != '') {
				addGoal(goal);
			}
		}

		useEffect(() => {
			const handler = (e) => {
				if(e.key == "Enter" && !e.repeat) {
					handleSubmit()
				}
			}

			document.addEventListener("keydown", handler)

			return () => document.removeEventListener("keydown", handler)
		}, [goalName, deadline])

		return (
			<div className='popup-container'>
				<div className='goal-popup'>
					<h1>Create a New Goal</h1>

					<div className='field'>
						<label htmlFor="goalName">Goal Name: </label>
						<input type="text" 
							id="goalName"
							value={goalName}
							onChange={(e) => {setGoalName(e.target.value)}}
							autoFocus={true}
							required
						/>
					</div>

					<div className='field deadline'>
						<h3>Deadline: </h3>
						<input type="date" 
							id="date"
							min={today}
							value={deadline}
							onChange={(e) => {setDeadline(e.target.value)}}
						/>
					</div>
					
					<button className='cancel' onClick={() => {setShowPopup(false)}}>X</button>
					<button className='submit' onClick={handleSubmit}>Add Goal</button>

				</div>
			</div>
		)
	}

	//===== METRICS CALCULATIONS =====
	//Completion Rate
	let completionRate = 0;
	for (let goal of goals) {
		let goalProgress = (goal.totalTasks == 0) ? 0 : Math.round((goal.completedTasks/goal.totalTasks) * 100);
		completionRate += goalProgress;
	}
	completionRate /= goals.length;

	return (
        <>
			<main>
				<Card className='goals' title='ACTIVE GOALS' tag='Filter'>
                    {goals.map((goal) => (
						<Link to="/GoalDetails" state={ goal } key={goal.id}>
                        <div key={goal.id} className='goal'>
                            <h2 className='goal-title'>{goal.goalName}</h2>
                            <div className='goal-info'>
                                <div>
                                    <p>TASKS</p>
                                    <h3>{goal.completedTasks}/{goal.totalTasks}</h3>
                                </div>
                                <div>
                                    <p>{goal.deadline.toString() ? "DAYS LEFT" : "STREAK"}</p>
                                    <h3>{goal.deadline.toString() ? goal.daysLeft.toString() : goal.streak.toString()}</h3>
                                </div>
                                <div>
                                    <p>XP</p>
                                    <h3>{goal.xp}</h3>
                                </div>
                            </div>
                            <div className='progress-bar'>
                                <div className="progress" style={{width: `${goal.totalTasks == 0 ? "0": (goal.completedTasks/goal.totalTasks) * 100}%`}}></div>
                            </div>
                        </div>
						</Link>
                    ))}
					
					<button className='add' onClick={() => {setShowPopup(true)}}>+ Add Goal</button>
				</Card>

				<Card className='metrics' title='METRICS'>
						<div className='metric-card'>
							<div className='info'>
								<p>Completion Rate</p>
								<h3>{completionRate.toFixed(2)}%</h3>
								<div className='bar'><div className="level" style={{width: completionRate}}></div></div>
							</div>
							<button>+12%</button>
						</div>
						<div className='metric-card'>
							<p>Avg. Tasks/Day</p>
						</div>
						<div className='metric-card'>
							<p>Focus Time</p>
						</div>
				</Card>
			</main>
			<Card className='priority' title='PRIORITY QUEUE' tag='Sort'>
				<div className='priorities'>
					{ goals.map((goal) => (
						<div className='slot' key={goal.id}>
							<div className='name'>{goal.goalName}</div>
							<div className='tag'>P0</div>
						</div>
					))}
				</div>
			</Card>
			{showPopup && <GoalPopup />}
        </>
	)
}

export default Home