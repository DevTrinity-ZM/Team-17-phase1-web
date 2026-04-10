import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Card component remains the same
function Card({ className, title, children, tag = '', metrics = '' }) {
    return React.createElement(
        'div',
        { className: `card ${className}` },
        React.createElement(
            'div',
            { className: 'top' },
            React.createElement('h1', { className: 'card-title' }, title),
            tag && React.createElement('button', null, `[${tag}]`)
        ),
        children,
        metrics && React.createElement(
            'div',
            { className: 'metric-container' },
            metrics.map((metric, index) =>
                React.createElement(
                    React.Fragment,
                    { key: index },
                    React.createElement(
                        'div',
                        { className: 'metric-card' },
                        metric,
                        React.createElement('div', null)
                    )
                )
            )
        )
    );
}

function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [goals, setGoals] = useState([]);

    // 1. Updated to port 4000
    useEffect(() => {
        fetch("http://localhost:4000/todos")
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error(err));
    }, []);

    // 2. Updated to port 4000 and improved the refresh logic
    async function addGoal(goalData) {
        try {
            await fetch("http://localhost:4000/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(goalData)
            });

            // Re-fetch from the correct port
            const res = await fetch("http://localhost:4000/todos");
            const updated = await res.json();
            setGoals(updated);
            setShowPopup(false);
        } catch (err) {
            console.error(err);
        }
    }

    function GoalPopup() {
        const today = new Date().toISOString().split('T')[0];
        const [goalName, setGoalName] = useState('');
        const [deadline, setDeadline] = useState('');

        const handleSubmit = () => {
            let now = new Date();
            now.setHours(0, 0, 0, 0);
            let end = new Date(deadline);
            end.setHours(0, 0, 0, 0);
            const days_left = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

            const goal = {
                // goalName matches your server.js variable
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

            if (goalName !== '') {
                addGoal(goal);
            }
        };

        return React.createElement(
            'div',
            { className: 'popup-container' },
            React.createElement(
                'div',
                { className: 'goal-popup' },
                React.createElement('h1', null, 'Create a New Goal'),
                React.createElement(
                    'div',
                    { className: 'field' },
                    React.createElement('label', { htmlFor: 'goalName' }, 'Goal Name: '),
                    React.createElement('input', {
                        type: 'text',
                        id: 'goalName',
                        value: goalName,
                        onChange: (e) => setGoalName(e.target.value),
                        required: true
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'field deadline' },
                    React.createElement('h3', null, 'Deadline: '),
                    React.createElement('input', {
                        type: 'date',
                        id: 'date',
                        min: today,
                        value: deadline,
                        onChange: (e) => setDeadline(e.target.value)
                    })
                ),
                React.createElement('button', { className: 'cancel', onClick: () => setShowPopup(false) }, 'X'),
                React.createElement('button', { className: 'submit', onClick: handleSubmit }, 'Add Goal')
            )
        );
    }

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'main',
            null,
            React.createElement(
                Card,
                { className: 'goals', title: 'ACTIVE GOALS', tag: 'Filter' },
                goals.map((goal) =>
                    React.createElement(
                        Link,
                        // 3. IMPORTANT: Use goal.todo_id from Postgres
                        { to: "/GoalDetails", state: goal, key: goal.todo_id },
                        React.createElement(
                            'div',
                            { className: 'goal' },
                            // Use description (DB name) or goalName (Frontend name)
                            React.createElement('h2', { className: 'goal-title' }, goal.description || goal.goalName),
                            React.createElement(
                                'div',
                                { className: 'goal-info' },
                                React.createElement('div', null, 
                                    React.createElement('p', null, 'TASKS'), 
                                    React.createElement('h3', null, `${goal.completed_tasks || 0}/${goal.total_tasks || 0}`)
                                ),
                                React.createElement('div', null, 
                                    React.createElement('p', null, goal.deadline ? "DAYS LEFT" : "STREAK"), 
                                    React.createElement('h3', null, goal.deadline ? (goal.daysLeft || "0") : (goal.streak || "0"))
                                ),
                                React.createElement('div', null, 
                                    React.createElement('p', null, 'XP'), 
                                    React.createElement('h3', null, goal.xp || '0')
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'progress-bar' },
                                React.createElement('div', {
                                    className: 'progress',
                                    style: { width: `${goal.total_tasks == 0 ? "0" : (goal.completed_tasks / goal.total_tasks) * 100}%` }
                                })
                            )
                        )
                    )
                ),
                React.createElement('button', { className: 'add', onClick: () => setShowPopup(true) }, '+ Add Goal')
            ),
            React.createElement(Card, {
                className: 'metrics',
                title: 'METRICS',
                metrics: ['Completion Rate', 'Avg. Tasks/Day', 'Focus Time']
            })
        ),
        React.createElement(
            Card,
            { className: 'priority', title: 'PRIORITY QUEUE', tag: 'Sort' },
            React.createElement(
                'div',
                { className: 'priorities' },
                goals.map((goal) =>
                    React.createElement(
                        'div',
                        { className: 'slot', key: goal.todo_id },
                        React.createElement('div', { className: 'name' }, goal.description || goal.goalName),
                        React.createElement('div', { className: 'tag' }, goal.priority === 'high' ? 'P0' : 'P1')
                    )
                )
            )
        ),
        showPopup && React.createElement(GoalPopup, null)
    );
}

export default Home;