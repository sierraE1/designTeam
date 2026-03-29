import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import ManageTasks from "./components/ManageTasks";
import MoodTracker from "./components/moodTracker";
import TaskDetail from "./components/TaskDetail";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/tasks" element={<ManageTasks />} />
				<Route path="/mood" element={<MoodTracker />} />
				<Route path="/tasks/:id" element={<TaskDetail />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
