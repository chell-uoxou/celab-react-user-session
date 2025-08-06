import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button = (props: ButtonProps) => {
  return (
    <button
      className="transition duration-50 bg-neutral-800 hover:bg-neutral-600 text-white px-4 py-2 rounded-xl"
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
