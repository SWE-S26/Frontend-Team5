"use client";

import { useRef, useState } from "react";
import {
  useFloating,
  useHover,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
  FloatingPortal,
  FloatingArrow,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
} from "@floating-ui/react";

export interface DropdownItem {
  type?: "separator";
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface MoreDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  width?: string;
  tooltipLabel?: string;
}

export default function MoreDropdown({
  trigger,
  items,
  width = "w-auto",
  tooltipLabel,
}: MoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const arrowRef = useRef(null);

  // Dropdown floating
  const {
    refs: dropdownRefs,
    floatingStyles: dropdownStyles,
    context: dropdownContext,
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift()],
  });

  const click = useClick(dropdownContext);
  const dismiss = useDismiss(dropdownContext);
  const role = useRole(dropdownContext, { role: "menu" });
  const { getReferenceProps: getDropdownRefProps, getFloatingProps } =
    useInteractions([click, dismiss, role]);

  // Tooltip floating
  const {
    refs: tooltipRefs,
    floatingStyles: tooltipStyles,
    context: tooltipContext,
  } = useFloating({
    open: showTooltip && !isOpen,
    onOpenChange: setShowTooltip,
    placement: "bottom",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
  });

  const hover = useHover(tooltipContext);
  const {
    getReferenceProps: getTooltipRefProps,
    getFloatingProps: getTooltipFloatingProps,
  } = useInteractions([hover]);

  function mergeRefs(...refs: any[]) {
    return (node: any) =>
      refs.forEach((ref) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      });
  }

  return (
    <>
      <div
        ref={mergeRefs(dropdownRefs.setReference, tooltipRefs.setReference)}
        {...getDropdownRefProps(getTooltipRefProps())}
        className="inline-block"
      >
        {trigger}
      </div>

      <FloatingPortal>
        {showTooltip && !isOpen && tooltipLabel && (
          <div
            ref={tooltipRefs.setFloating}
            style={tooltipStyles}
            {...getTooltipFloatingProps()}
            className="z-[9999] pointer-events-none"
          >
            <FloatingArrow
              ref={arrowRef}
              context={tooltipContext}
              className="fill-off-black"
              width={10}
              height={5}
            />
            <div className="px-2 py-1 bg-off-black text-white-smoke text-[11px] rounded border border-chinese-black whitespace-nowrap">
              {tooltipLabel}
            </div>
          </div>
        )}
      </FloatingPortal>

      <FloatingPortal>
        {isOpen && (
          <div
            ref={dropdownRefs.setFloating}
            style={dropdownStyles}
            {...getFloatingProps()}
            className={`z-[9999] flex flex-col ${width} bg-chinese-black border border-silver/40 rounded-sm py-2`}
          >
            {items.map((item, index) => (
              <button
                key={index}
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 pl-3 pr-6 py-1.5 text-left transition-colors ${
                  item.disabled
                    ? "text-silver/50 cursor-not-allowed"
                    : "text-white-smoke hover:text-white-smoke/50 cursor-pointer"
                }`}
              >
                {item.icon && (
                  <span className="text-lg shrink-0">{item.icon}</span>
                )}
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
