import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import RouterLoader from "./components/routerLoader";

interface PrivateRouteProps {
	children: ReactNode;
}

export default function Private({ children }: PrivateRouteProps) {
	const { signed, loadingAuth } = useContext(AuthContext)!;
	if (loadingAuth) {
		return <RouterLoader />;
	}
	if (!signed) {
		return <Navigate to="/login" />;
	}
	return children;
}
