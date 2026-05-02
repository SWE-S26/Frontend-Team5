"use client";

import Button from "@/components/ui/Button";
import { useRef, useState } from "react";
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
} from "@floating-ui/react";

interface ConfirmPopoverProps {
  children: React.ReactNode;
  message?: string;
  onConfirm: () => void;
}

export default function ConfirmPopover({
  children,
  message = "Do you really want to remove this comment?",
  onConfirm,
}: ConfirmPopoverProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  return (
    <>
     
      <span ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>

      <FloatingPortal>
        {open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-9999"
          >
            {/* Arrow (LIKE ProfilePopover) */}
            <div
              ref={arrowRef}
              style={{
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
              }}
              className="absolute -bottom-1.5 w-3 h-3 bg-chinese-black border-r border-b border-white-smoke/10 rotate-45"
            />

            {/* Card */}
            <div className="w-72 rounded-s bg-chinese-black border border-white-smoke/10 shadow-2xl p-5">
              {/* Message */}
              <p className="text-white-smoke text-sm font-medium leading-relaxed">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-5">
                <Button
                  onClick={() => setOpen(false)}
                  className="text-white-smoke px-4 py-1.5 rounded-s text-sm bg-transparent border border-white-smoke/20 hover:bg-white-smoke/10 transition"
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    onConfirm();
                    setOpen(false);
                  }}
                  className="text-chinese-black px-4 py-1.5 rounded-s text-sm bg-white-smoke hover:opacity-90 transition"
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}