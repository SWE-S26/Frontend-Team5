"use client";
import { ConfigProvider } from "antd";

export default function AntProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--crusta)",
          colorBgBase: "var(--bg)",
          colorTextBase: "var(--fg)",
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
