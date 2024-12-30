'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from "react";
import TodoPage from "@/app/components/TodoPage";


const queryClient = new QueryClient();

export default function Home() {

    return (<QueryClientProvider client={queryClient}>
        <TodoPage/>
    </QueryClientProvider>)
}
