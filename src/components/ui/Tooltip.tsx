"use client";

import React, { useState, useRef } from "react";
import {
  useFloating,
  useHover,
  useInteractions,
  FloatingPortal,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
  FloatingArrow,
} from "@floating-ui/react";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export default function Tooltip({ label, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-9999 pointer-events-none"
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-off-black"
              width={10}
              height={5}
            />
            <div className="px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded border border-chinese-black whitespace-nowrap">
              {label}
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
