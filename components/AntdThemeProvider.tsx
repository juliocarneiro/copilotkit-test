"use client";

import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: "#000000",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
