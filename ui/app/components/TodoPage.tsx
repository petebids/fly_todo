'use client';

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import builder from "@/app/lib/rsql/builder";
import { emit } from "@rsql/emitter";
import CreateTodoForm from "@/app/components/CreateTodoForm";
import TodoList from "@/app/components/TodoList";

// The top-level page component
export default function TodoPage() {
    const [name, setName] = useState("");

    return (
        <div>
            <h1>Create a new todo!</h1>
            <CreateTodoForm />

            <div>
                <label htmlFor="name" className="block mb-1">
                    Filter todos by name
                </label>
                <input
                    id="name"
                    type="text"
                    style={{ color: 'black' }}
                    placeholder="Search by Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2"
                />
            </div>

            {/* Separate child that handles the React Query fetch */}
            <TodosData name={name} />
        </div>
    );
}

// The child component that fetches + renders the todo list
function TodosData({ name }: { name: string }) {
    const {
        data,
        isLoading,
        error
    } = useQuery<Page<Todo>, Error>({
        queryKey: ["todoList", name],
        queryFn: () => fetchTodosRsql(name)
    });

    if (error) {
        return <div>Error...</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (!data) {
        return <div>No data</div>;
    }

    // If we have data, render the table
    return <TodoList todos={data} />;
}

async function fetchTodosRsql(name: string): Promise<Page<Todo>> {
    const result = await fetch(
        `http://localhost:8080/v1/todos?q=${encodeURIComponent(buildQuery(name))}`
    );
    return result.json();
}

function buildQuery(name: string): string {
    // Emit a simple RSQL query: i.e. name==*searchText*
    return emit(builder.ilike("name", name));
}
