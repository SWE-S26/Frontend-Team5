"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";

export default function AntProviders({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "var(--crusta)",
            colorBgBase: "var(--bg)",
            colorTextBase: "var(--fg)",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
