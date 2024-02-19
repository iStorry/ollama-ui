import "y/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "y/trpc/react";
import type { Metadata } from "next";
import { config } from "y/config/site";
import { OllamaProvider } from "y/components/_app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: config.site.name,
    template: `%s - ${config.site.name}`,
  },
  description: config.site.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [{ name: "Jatinjit Singh", url: "https://istorry.com" }],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <OllamaProvider>{children}</OllamaProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
