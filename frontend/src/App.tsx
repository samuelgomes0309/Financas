import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Private from "./routes/PrivateRoute";
import Public from "./routes/PublicRoute";
import Profile from "./pages/profile";
import Register from "./pages/register";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Private>
				<Dashboard />
			</Private>
		),
	},
	{
		path: "/register",
		element: (
			<Private>
				<Register />
			</Private>
		),
	},
	{
		path: "/profile",
		element: (
			<Private>
				<Profile />
			</Private>
		),
	},
	{
		path: "/login",
		element: (
			<Public>
				<Login />
			</Public>
		),
	},
]);

export default router;
