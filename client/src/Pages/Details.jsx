import { useLocation } from "react-router-dom";

function Details() {
	const { state } = useLocation();
	const name = String(state.goalName);

	return <div>
		<h1>This is the goal: {name}</h1>
	</div>
}

export default Details