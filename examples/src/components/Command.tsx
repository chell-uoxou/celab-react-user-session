import { Check, ChevronRight, Copy } from "lucide-react";
import { PropsWithChildren, useState } from "react";

interface CommandProps extends PropsWithChildren {
  isCopyable?: boolean;
}

const Command = ({ isCopyable, children }: CommandProps) => {
  const [isCheckIcon, setIsCheckIcon] = useState(false);

  const onClick = () => {
    if (isCopyable) {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      if (typeof children !== "string") {
        console.warn("Command content is not a string, cannot copy.");
        return;
      }

      navigator.clipboard.writeText(children as string).then(() => {
        setIsCheckIcon(true);
        setTimeout(() => setIsCheckIcon(false), 2000);
      });
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-xl w-full justify-between font-mono text-sm p-1">
      <div className="flex items-start gap-2 px-2.5 py-2">
        <ChevronRight className="text-gray-500 h-5 w-4" size={16} />
        <code className="min-h-5 flex-1 break-all">{children}</code>
      </div>
      {isCopyable && (
        <button
          className="transition p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200"
          onClick={onClick}
        >
          {isCheckIcon ? (
            <Check className="text-gray-500" size={16} />
          ) : (
            <Copy className="text-gray-500" size={16} />
          )}
        </button>
      )}
    </div>
  );
};

export default Command;
