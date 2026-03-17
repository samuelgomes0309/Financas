import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./App.tsx";
import { AuthContextProvider } from "./contexts/authContext.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
	<AuthContextProvider>
		<Toaster position="top-right" toastOptions={{ duration: 3000 }} />
		<RouterProvider router={router} />
	</AuthContextProvider>
);
