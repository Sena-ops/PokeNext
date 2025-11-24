import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { RootLayoutClient } from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokéTeam Trainer - Construa o Time Perfeito",
  description: "Analise e construa times de Pokémon com sinergia perfeita. Descubra fraquezas, pontos fortes e otimize sua estratégia.",
  keywords: "pokemon, team builder, synergy, analyzer, pokedex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Providers>
            <RootLayoutClient>
              {children}
            </RootLayoutClient>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

