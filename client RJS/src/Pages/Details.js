import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Details() {
    const { state } = useLocation();
    // Use todo_id to match your Postgres column
    const [goal, setGoal] = useState(state);

    useEffect(() => {
        fetch(`http://localhost:4000/todos/${state.todo_id}`)
            .then(res => res.json())
            .then(data => setGoal(data))
            .catch(err => console.error(err));
    }, []);

    async function updateGoal(updatedGoal) {
        try {
            await fetch(`http://localhost:4000/todos/${state.todo_id}`, {
                // Use PUT to match your server.js route
                method: "PUT", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: updatedGoal.description || updatedGoal.goalName,
                    tasks: updatedGoal.tasks,
                    completed_tasks: updatedGoal.completed_tasks,
                    total_tasks: updatedGoal.total_tasks,
                    xp: updatedGoal.xp,
                    priority: updatedGoal.priority,
                    deadline: updatedGoal.deadline
                })
            });
        } catch (err) {
            console.log("Sync Error:", err);
        }
    }

    function handleEnter(e) {
        if (e.key == "Enter" && e.target.value !== "") {
            addTask(e.target.value);
            e.target.value = "";
        }
    }

    async function check(e) {
        const taskID = Number(e.target.id);
        
        // 1. Calculate new values
        const newTasks = goal.tasks.map((task, index) =>
            index === taskID ? { ...task, completed: !task.completed } : task
        );
        const newCompletedCount = newTasks.filter(t => t.completed).length;
        const newXP = newCompletedCount * 5;

        // 2. Build the updated object
        const updatedGoal = {
            ...goal,
            tasks: newTasks,
            completed_tasks: newCompletedCount,
            xp: newXP
        };

        // 3. Update UI and Server in one go
        setGoal(updatedGoal);
        updateGoal(updatedGoal);
    }

    async function addTask(taskText) {
        const taskObj = { text: taskText, completed: false };
        const newTasks = [...(goal.tasks || []), taskObj];
        
        const updatedGoal = { 
            ...goal, 
            tasks: newTasks, 
            total_tasks: newTasks.length 
        };
        
        setGoal(updatedGoal);
        updateGoal(updatedGoal);
    }

    // --- RENDER LOGIC ---
    const progress = goal.total_tasks > 0 
        ? Math.round((goal.completed_tasks / goal.total_tasks) * 100) 
        : 0;

    return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", { className: "date" }, new Date().toDateString()),
        React.createElement(
            "div",
            { className: "card details" },
            React.createElement(
                "div",
                { className: "top-details" },
                React.createElement("h1", { className: "title" }, goal.description || goal.goalName),
                React.createElement(
                    "button",
                    {
                        className: "delete",
                        onClick: async () => {
                            await fetch(`http://localhost:4000/todos/${state.todo_id}`, { method: "DELETE" });
                            window.location.href = "/";
                        }
                    },
                    "Delete" // Simplified for brevity
                )
            ),
            React.createElement(
                "div",
                { className: "progress-bar" },
                React.createElement("div", {
                    className: "progress",
                    style: { width: `${progress}%` }
                })
            ),
            React.createElement(
                "div",
                { className: "goal-details" },
                React.createElement("p", null, `Progress: ${progress}%`),
                React.createElement("p", null, `Tasks Done: ${goal.completed_tasks || 0}`),
                React.createElement("p", null, `Total Tasks: ${goal.total_tasks || 0}`),
                React.createElement("p", null, `XP: ${goal.xp || 0}`)
            ),
            React.createElement(
                "div",
                { className: "card tasks" },
                React.createElement("h1", { className: "title" }, "Tasks"),
                React.createElement(
                    "div",
                    null,
                    (goal.tasks || []).map((n, index) =>
                        React.createElement(
                            "div",
                            { className: "task-container", key: index },
                            React.createElement(
                                "label",
                                { className: "checkbox-container" },
                                React.createElement("input", {
                                    type: "checkbox",
                                    onChange: check,
                                    id: index,
                                    checked: !!n.completed
                                }),
                                React.createElement("span", { className: "checkmark" }),
                                React.createElement("p", null, n.text)
                            ),
                            React.createElement("div", { className: "xp" }, "5XP")
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "task-input" },
                        React.createElement("input", {
                            type: "text",
                            placeholder: "Enter a task here...",
                            onKeyDown: handleEnter
                        })
                    )
                )
            )
        )
    );
}

export default Details;