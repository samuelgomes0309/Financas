interface LabelRegProps {
	message: string;
}

export default function LabelReg({ message = "Sem label" }: LabelRegProps) {
	return <label className="my-1.5 font-semibold text-black">{message}</label>;
}
