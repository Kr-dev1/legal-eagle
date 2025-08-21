"use client"

import React, { useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

interface Props {
    children: React.ReactNode
}

const QueryProvider = ({ children }: Props) => {
    const [query] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={query}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider