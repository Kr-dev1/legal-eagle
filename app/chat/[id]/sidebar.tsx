"use client"
import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronUp, Plus, User2 } from "lucide-react"
import { useGetContracts } from "./api/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import Logo from "@/public/logo.svg"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: contracts, isLoading } = useGetContracts()
    const session = authClient.useSession().data?.user
    const router = useRouter()
    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.replace("/signin")
                },
                onError: () => {
                    toast.error("Failed to Sign out please try again")
                }
            }

        })
    }


    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <p className="flex items-center">
                                <Image src={Logo} height={24} width={24} alt="logo" />
                                <span className="text-base font-semibold">Legal Hawk</span>
                            </p>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="list-none mt-2">
                <div className="flex flex-col justify-center items-center gap-12">
                    <SidebarMenu>
                        {isLoading &&
                            <div className="flex justify-center items-center">
                                <Spinner />
                            </div>
                        }
                        {contracts?.data?.map((item: any) => (
                            <SidebarMenuItem key={item.id}>
                                <Link href={`/chat/${item.id}`}>
                                    <SidebarMenuButton
                                        isActive={item.id === props.id}
                                    >
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>

                    <div>
                        {contracts?.data?.length <= 3 &&
                            <Button asChild>
                                <Link
                                    href="/upload?new=true"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Plus /> Add new contract
                                </Link>
                            </Button>
                        }
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Avatar>
                                        {session?.image &&
                                            <AvatarImage src={session?.image} />
                                        }
                                    </Avatar>
                                    {session?.name}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem onClick={signOut}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    )
}
