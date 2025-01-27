import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";

import { Toaster } from "@/components/ui/toaster";
import { HeaderAuth } from "@/components/header-auth";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Amana louvor",
  description: "Cifras e letras de músicas para louvor da igreja amana",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-10 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <div className="relative aspect-square  w-12">
                      <Image
                        alt="imagem da igreja amana"
                        fill
                        className="object-cover"
                        src="https://static.wixstatic.com/media/088db6_5929115330a946a984f712ded85fb4e3~mv2.png/v1/fill/w_222,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20branca_edited.png"
                      />
                    </div>
                    <Link href={"/"}>Amana Louvor</Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>

              <div className="flex flex-col gap-20 max-w-5xl w-full p-0">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-16">
                {/* <ThemeSwitcher /> */}
              </footer>
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
