'use client'
import {useParams} from 'next/navigation'
import {useEffect, useState} from 'react';
import Link from "next/link";

export default function Page() {
    const {todoId} = useParams()
    const [todo, setTodo] = useState<TodoFull | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!todoId) return;

        const fetchTodo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/todos/${todoId}`);
                if (!response.ok) throw new Error('Failed to fetch todo');
                const data = await response.json();
                setTodo(data);
            } catch  {
                setError('Error fetching todo');
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [todoId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!todo) return <div>Todo not found</div>;

    return (
        <div>
            <Link href={"/"}
            >Back
            </Link>
            <h1>Todo Detail</h1>
            <p>ID: {todo.id}</p>
            <p>Name: {todo.name}</p>
            <p>Completed: {todo.completed ? "Yes" : "No"}</p>
            <p>Details: {todo.details}</p>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Details
                        </th>
                        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Completed?
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {todo.checklistItems.map((item: Item, index: number) => (
                        <tr
                            key={item.details}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >

                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                {item.details}
                            </td>

                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                {item.completed ? "Yes" : "No"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
