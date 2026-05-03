"use client";
interface SendButtonProps {
  onClick?: () => void;
}
const SendButton = ({ onClick }: SendButtonProps) => {
  return (
    <>
      <button
        className="text-chinese-black text-sm bg-white-smoke w-17 h-10 rounded-md font-bold px-1 py-1 hover:text-silver cursor-pointer"
        onClick={onClick}
      >
        Send
      </button>
    </>
  );
};

export default SendButton;
