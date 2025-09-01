"use client"

import { useGetContracts } from "@/app/chat/[id]/api/api"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
export function ChatHeader({ id }: { id: string | undefined }) {
    const { data: contracts, isLoading } = useGetContracts()
    const contractTitle = contracts?.data.filter((item: any) => item.id === id)[0] || ""
    return (
        <header className="sticky top-2 bg-neutral-800 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{contractTitle.title}</h1>
            </div>
        </header>
    )
}
