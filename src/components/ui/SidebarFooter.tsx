import React from "react";

export default function SidebarFooter() {
  return (
    <div className="text-xs text-silver leading-6">
      {[
        "Legal",
        "Privacy",
        "Cookie Policy",
        "Cookie Manager",
        "Imprint",
        "Artist Resources",
        "Newsroom",
        "Charts",
        "Transparency Reports",
      ].map((label, i, arr) => (
        <span key={label}>
          <span className="hover:text-white-smoke cursor-pointer">{label}</span>
          {i < arr.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}
