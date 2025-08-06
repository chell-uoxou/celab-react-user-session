import { Link } from "react-router-dom";

interface ExampleLinkProps {
  href: string;
  title: string;
  description?: string;
}

const ExampleLink = (props: ExampleLinkProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Link
        to={props.href}
        className="text-blue-500 hover:underline underline-offset-4"
      >
        <h2 className="text-xl font-mono font-bold">{props.title}</h2>
      </Link>
      {props.description}
    </div>
  );
};

export default ExampleLink;
