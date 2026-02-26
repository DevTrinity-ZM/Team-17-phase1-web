import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

//id in this case is used for styling, title is for the card, children is the card contents
//tag is the button on the top right of the card, where available
//metrics is only for the METRICS card
function Card({ className, title, children, tag='', metrics=''}) {
	return (
		<div className={`card ${className}`}>
			<div className='top'>
				<h1 className='card-title'>{title}</h1>
				{tag && <button>[{tag}]</button>}
			</div>

			{children}

			{/*Display metrics only for the metrics card*/}
			{metrics && (
				<div className='metric-container'>
					{
						metrics.map((metric, index) => {
							return (
								<div key={index} className='metric-card'>{metric}</div>
							)
						})
					}
				</div>
			)}
		</div>
	)
}

function Home() {
	const [showPopup, setShowPopup] = useState(false);
	const [goals, setGoals] = useState(() => {
		const saved = localStorage.getItem('goals');
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
			localStorage.setItem('goals', JSON.stringify(goals));
	}, [goals])
		
	function addGoal(goalData) {
		setGoals([...goals, goalData]);
		setShowPopup(false);
	}

	function GoalPopup() {
		//date
		const today = new Date().toISOString().split('T')[0];
		//for goal information input
		const [goalName, setGoalName] = useState('');
		const [deadline, setDeadline] = useState('');
		const [totalTasks, setTotalTasks] = useState(0);
		const [completedTasks, setCompletedTasks] = useState(0);
		const [streak, setStreak] = useState(0);

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
				streak: streak,
				totalTasks: totalTasks,
				completedTasks: completedTasks,
			};

			if(goalName != '') {
				addGoal(goal);
			}
		}

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

					<div className='field tasks'>
						<h3>Number of tasks: </h3>
						<input type="number" 
							id="tasks"
							value={totalTasks}
							onInput={(e) => {setTotalTasks(e.target.value)}}
						/>
					</div>
					
					<button className='cancel' onClick={() => {setShowPopup(false)}}>X</button>
					<button className='submit' onClick={handleSubmit}>Add Goal</button>
				</div>
			</div>
		)
	}

	return (
        <>
			<main>
				<Card className='goals' title='ACTIVE GOALS' tag='Filter'>
                    {goals.map((goal) => (
						<Link to="/GoalDetails" state={ goal }>
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
                                    <h3>0</h3>
                                </div>
                            </div>
                            <div className='progress-bar'>
                                <div className="progress"></div>
                            </div>
                        </div>
						</Link>
                    ))}
					
					<button className='add' onClick={() => {setShowPopup(true)}}>+ Add Goal</button>
				</Card>
				<Card className='metrics' title='METRICS' metrics={['Completion Rate', 'Avg. Tasks/Day', 'Focus Time']}></Card>
			</main>
			<Card className='priority' title='PRIORITY QUEUE' tag='Sort'>
				<div className='priorities'>
					{ goals.map((goal) => (
						<div className='slot' key={goal.id}>
							<div>{goal.goalName}</div>
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