import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Details from './Pages/Details';
import Home from './Pages/Home';
import { useState, useEffect } from 'react';

function AppContent() {
	const location = useLocation();
	const [goals, setGoals] = useState([]);
	const [completed, setCompleted] = useState([]);
	useEffect(() => {
		fetch("http://localhost:3001/goals")
			.then(res => res.json())
			.then(data => setGoals(data))
			.catch(err => console.error(err));
	}, []);

	useEffect(() => {
		fetch("http://localhost:3001/goals/completed")
			.then(res => res.json())
			.then(data => setCompleted(data))
			.catch(err => console.error(err));
	}, []);

	let totalXP = 0;
	for (let goal of goals) {
		totalXP += goal.xp;
	}

	return (
		<>
			<nav>
				<Link to="/" onClick={document.location.reload}>
				<div className='logo-section'>
					<div className='logo'><img src="/logo.png" alt="website logo" /></div>
					<h1>Momentum</h1>
				</div>
				</Link>

				<div className='data'>
					<div>
						<p>ACTIVE</p>
						<h2>{goals.length}</h2>
					</div>
					<div>
						<p>COMPLETED</p>
						<h2>{completed.length}</h2>
					</div>
					<div>
						<p>Total XP</p>
						<h2>
							{totalXP}
						</h2>
					</div>
				</div>

				<div className='account'>
					<h3>BenK</h3>
					<div className="profile"></div>
				</div>
			</nav>
			
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/goalDetails" element={<Details />}></Route>
			</Routes>
		</>
	)
}

function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	)
}

export default App
