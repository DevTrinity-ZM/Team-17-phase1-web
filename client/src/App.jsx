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
	const [goals, setGoals] = useState([])

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
						<div key={index} className='goal'>{goal}</div>
					))}
					
					<button className='add' onClick={() => {
						setGoals([...goals, '<div className="goal"></div>'])
					}}>+ Add Goal</button>
				</Card>
				<Card className='metrics' title='METRICS' metrics={['Completion Rate', 'Avg. Tasks/Day', 'Focus Time']}></Card>
			</main>
			<Card className='priority' title='PRIORITY QUEUE' tag='Sort'>
				<div>Priority 1</div>
				<div>Priority 2</div>
			</Card>
		</>
	)
}

export default App
