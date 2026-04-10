import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Details from './Pages/Details';
import Home from './Pages/Home';

function App() {
    const [goals, setGoals] = useState([]);
    const [completedCount, setCompletedCount] = useState(0);

    // 1. Fetch Goals from Port 4000
    useEffect(() => {
        fetch("http://localhost:4000/todos")
            .then(res => res.json())
            .then(data => {
                setGoals(data);
                // If you don't have a separate table for completed goals yet,
                // we can count goals where all tasks are done.
                const count = data.filter(g => g.completed_tasks > 0 && g.completed_tasks === g.total_tasks).length;
                setCompletedCount(count);
            })
            .catch(err => console.error("App Fetch Error:", err));
    }, []);

    // 2. Calculate Total XP dynamically from your goals list
    const totalXP = goals.reduce((acc, goal) => acc + (goal.xp || 0), 0);

    return React.createElement(
        BrowserRouter,
        null,
        React.createElement(
            'nav',
            null,
            React.createElement(
                Link,
                { to: "/" },
                React.createElement(
                    'div',
                    { className: 'logo-section' },
                    React.createElement(
                        'div',
                        { className: 'logo' },
                        React.createElement('img', { src: "/logo.png", alt: "website logo" })
                    ),
                    React.createElement('h1', null, 'Momentum')
                )
            ),
            React.createElement(
                'div',
                { className: 'data' },
                React.createElement(
                    'div',
                    null,
                    React.createElement('p', null, 'ACTIVE'),
                    React.createElement('h2', null, goals.length)
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement('p', null, 'COMPLETED'),
                    React.createElement('h2', null, completedCount)
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement('p', null, 'TOTAL XP'),
                    // Display the real XP from the database
                    React.createElement('h2', null, totalXP)
                )
            ),
            React.createElement(
                'div',
                { className: 'account' },
                React.createElement('h3', null, 'BenK'),
                React.createElement('div', { className: 'profile' })
            )
        ),
        React.createElement(
            Routes,
            null,
            React.createElement(Route, {
                path: "/",
                element: React.createElement(Home, null)
            }),
            React.createElement(Route, {
                path: "/goalDetails",
                element: React.createElement(Details, null)
            })
        )
    );
}

export default App;