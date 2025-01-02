import Link from "next/link";
import {TrashIcon} from '@heroicons/react/24/outline';
import {useMutation, useQueryClient} from "@tanstack/react-query";

async function handleDeleteTodo(id: string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/todos/${id}`, {
        method: 'DELETE'
    });

    if (response.status !== 204) {
        throw Error()
    }
}


async function completeTodo(id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/todos/${id}:complete`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw Error()
    }
}

export default function TodoList({todos}: { todos: Page<Todo> }) {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: handleDeleteTodo,
        onSuccess: () => queryClient.refetchQueries(),
        onError: (error, variables, context) => {
            console.log(variables)
            console.log(context)
            alert(error)
        }
    })

    const completeMutation = useMutation({
        mutationFn: completeTodo,
        onSuccess: () => queryClient.refetchQueries(),
        onError: (error, variables, context) => {
            console.log(variables)
            console.log(context)
            alert(error)
        }

    })

    return (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
            {todos.content.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                            ID
                        </th>
                        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Name
                        </th>
                        <th className="border border-gray-200 px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Completed?
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {todos.content.map((todo: Todo, index: number) => (
                        <tr
                            key={todo.id}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                <Link href={`/${todo.id}`} className="text-blue-600 hover:underline">
                                    {todo.id}
                                </Link>
                            </td>
                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                {todo.name}
                            </td>
                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                {todo.completed ? "Yes" : "No"}
                            </td>

                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => {
                                        completeMutation.mutate(todo.id)
                                    }}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                            </td>
                            <td className="border border-gray-200 px-6 py-3 text-sm text-gray-900">
                                <button
                                    onClick={() => deleteMutation.mutate(todo.id)}
                                    className="inline-flex items-center text-red-600 hover:text-red-800"
                                    title="Delete this todo"
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : <div style={{color: 'black'}}>No todos to display !</div>}
        </div>
    )
}