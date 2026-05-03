"use client";

interface EmptyMessagesProps {
  onOpenPopup: () => void;
}

const EmptyMessages = ({ onOpenPopup }: EmptyMessagesProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full w-full mt-25">
      <div className="py-2">
        <h2 className="font-bold text-sm text-white-smoke">You have no messages</h2>
      </div>
      <p className="text-white-smoke text-sm">
        Send someone a message and make their day.{" "}
        <button onClick={onOpenPopup} className="text-blue-400 cursor-pointer ">
          write one
        </button>
      </p>
    </div>
  );
};
export default EmptyMessages;
