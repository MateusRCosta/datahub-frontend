"use client";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from "@/lib/query-client";
import { env } from "@/lib/env";

export default function AppProvider({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient} >
            {env.NODE_ENV === "development" && <ReactQueryDevtools />}
            <ThemeProvider attribute="class" storageKey="app-theme" enableSystem={true}>
                <Toaster />
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
};