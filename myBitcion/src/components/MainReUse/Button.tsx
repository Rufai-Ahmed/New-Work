import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface iButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	name?: any;
	icon?: ReactNode;
}


const Button: FC<iButtonProps> = ({
	icon,
	name,
	className,
	...props
}) => {
	return (
		<button
			{...props}
			className={twMerge(
				`px-6 py-2 border rounded-md m-2 overflow-hidden flex items-center justify-center text-white`,
				className
			)}
		>
			<div className="mr-2 text-[30px] text-white ">{icon}</div>
			<div className="text-white">{name}</div>
		</button>
	);
};

export default Button;
