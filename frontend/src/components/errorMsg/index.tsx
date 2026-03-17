import type { ReactNode } from "react";

interface ErrorMsgProps {
	children: ReactNode;
}

export default function ErrorMsg({ children }: ErrorMsgProps) {
	return <span className="my-1 text-red-400">{children}</span>;
}
