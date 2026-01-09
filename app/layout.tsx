import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdThemeProvider } from "@/components/AntdThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CopilotKit Teste Voa",
  description: "Gerencie suas tarefas com IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <AntdRegistry>
          <AntdThemeProvider>{children}</AntdThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
