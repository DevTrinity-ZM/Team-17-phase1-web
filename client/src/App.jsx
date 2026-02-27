import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Details from './Pages/Details';
import Home from './Pages/Home';

function App() {
	return (
		<BrowserRouter>
			<nav>
				<Link to="/">
				<div className='logo-section'>
					<div className="logo">M</div>
					<h1>Momentum</h1>
				</div>
				</Link>

				<div className='data'>
					<div>
						<p>ACTIVE</p>
						<h2>{JSON.parse(localStorage.getItem('goals')).length}</h2>
					</div>
					<div>
						<p>COMPLETED</p>
						<h2>0</h2>
					</div>
					<div>
						<p>TOTAL XP</p>
						<h2>0</h2>
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
		</BrowserRouter>
	)
}

export default App
