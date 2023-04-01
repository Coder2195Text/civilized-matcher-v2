import { Button } from "@material-tailwind/react";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: ReactNode;
}

const ActionButton: FC<Props> = ({
  onClick,
  text,
  children,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      variant="text"
      color="blue-gray"
      className={twMerge(
        "inline-block items-start p-3 text-2xl text-black bg-pink-300 rounded-md transition-all hover:bg-pink-500 border-2 border-purple-400",
        className || ""
      )}
      onClick={onClick}
    >
      {text}
      {children && (
        <>
          <hr className="my-3" />
          {children}
        </>
      )}
    </Button>
  );
};

export default ActionButton;
