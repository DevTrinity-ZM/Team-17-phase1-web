import { Children, useState } from 'react'
import './App.css'

//id in this case is used for styling, title is for the card, children is the card contents
//tag is the button on the top right of the card, where available
//metrics is only for the METRICS card
function Card({ id, title, children, tag='', metrics=''}) {
	return (
		<div className='card' id={id}>
			<div className='top'>
				<h1 className='card-title'>{title}</h1>
				{tag ? <button>[{tag}]</button> : ''}
			</div>
			{Children.map(children, child => 
				<div>{child}</div>
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
				<Card id='goals' title='ACTIVE GOALS' tag='Filter'>
					<div className='goal'></div>
					<div className='goal'></div>
					<div className='goal'></div>
					
					<button className='add' onClick={() => {
						goals.push('yo')
						console.log(goals)
					}}>+ Add Goal</button>
					<ul>
						{goals.map(goal => (
							<li key='ye'>{goal}</li>
						))}
					</ul>
				</Card>
				<Card id='metrics' title='METRICS' metrics={['Completion Rate', 'Avg. Tasks/Day', 'Focus Time']}></Card>
			</main>
			<Card id='priority' title='PRIORITY QUEUE' tag='Sort'>
				<div>Priority 1</div>
				<div>Priority 2</div>
			</Card>
		</>
	)
}

export default App
