import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import type { ReactNode } from "react"
import React from "react"
import { AppSidebar } from "./sidebar"
import { ChatHeader } from "@/components/header/chatHeader"

export default function Layout({ children, params }: { children: ReactNode, params?: Promise<{ id?: string }> }) {
    const resolvedParams = params ? React.use(params) : undefined
    const id = resolvedParams?.id
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 60)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
            className="h-screen overflow-hidden"
        >
            <AppSidebar variant="inset" id={id} />
            <SidebarInset className="w-full h-screen bg-neutral-800">
                <ChatHeader id={id} />
                <div className="flex-1 h-[calc(100vh-var(--header-height))] w-full overflow-hidden">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}
