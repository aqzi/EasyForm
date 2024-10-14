import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Providers from "./providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: "400", style: "normal" });

export const metadata: Metadata = {
    title: "EasyForm",
    description: "Open Source Form Creator and Manager - simple, secure and customizable",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
    const session = await auth()

    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <SessionProvider session={session}>
                        <Suspense>
                            {children}
                        </Suspense>
                    </SessionProvider>
                </Providers>
            </body>
        </html>
    )
}