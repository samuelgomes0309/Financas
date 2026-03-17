interface LabelMsgProps {
	message: string;
}

export default function LabelMsg({ message = "Sem label" }: LabelMsgProps) {
	return <label className="my-1.5 font-semibold text-black">{message}</label>;
}
