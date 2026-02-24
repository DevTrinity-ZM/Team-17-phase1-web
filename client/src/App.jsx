import { Children, useState } from 'react'
import './App.css'

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

function App() {
	const [showPopup, setShowPopup] = useState(false);
	const [goals, setGoals] = useState([]);

	function addGoal(goalData) {
		setGoals([...goals, goalData]);
		setShowPopup(false);
	}

	function GoalPopup() {
		//for goal information input
		const [goalName, setGoalName] = useState('');

		function submit() {
			const newGoal = {
				id: Date.now(),
				name: goalName,
			}

			addGoal(newGoal);
		}

		return (
			<div className='popup-container'>
				<div className='goal-popup'>
					<h1>Goal Name:</h1>
					<input type="text" 
					value={goalName}
					onChange={(e) => {setGoalName(e.target.value)}}/>
					<button className='cancel' onClick={() => {setShowPopup(false)}}>X</button>
					<button className='submit' onClick={submit}>Add Goal</button>
				</div>
			</div>
		)
	}

	return (
		<>
			<nav>
				<div className='logo-section'>
					<div className="logo">M</div>
					<h1>Momentum</h1>
				</div>

				<div className='data'>
					<div>
						<p>ACTIVE</p>
						<h2>0</h2>
					</div>
					<div>
						<p>COMPLETED</p>
						<h2>0</h2>
					</div>
					<div>
						<p>SREAK</p>
						<h2>0d</h2>
					</div>
				</div>

				<div className='account'>
					<h3>BenK</h3>
					<div className="profile"></div>
				</div>
			</nav>
			<main>
				<Card className='goals' title='ACTIVE GOALS' tag='Filter'>
					{goals.map((goal, index) => (
						<div key={index} className='goal'>
							<h2 className='goal-title'>{goal.name}</h2>
							<div className='goal-info'></div>
							<div className='progress-bar'>
								<div className="progress"></div>
							</div>
						</div>
					))}
					
					<button className='add' onClick={() => {setShowPopup(true)}}>+ Add Goal</button>
				</Card>
				<Card className='metrics' title='METRICS' metrics={['Completion Rate', 'Avg. Tasks/Day', 'Focus Time']}></Card>
			</main>
			<Card className='priority' title='PRIORITY QUEUE' tag='Sort'>
				<div>Priority 1</div>
				<div>Priority 2</div>
			</Card>
			{showPopup && <GoalPopup />}
		</>
	)
}

export default App
