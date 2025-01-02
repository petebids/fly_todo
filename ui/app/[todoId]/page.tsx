'use client'
import {useParams} from 'next/navigation'
import {useQuery} from "@tanstack/react-query";
import TodoDetail from "@/app/components/TodoDetail";

type Params = {
    todoId: string;
};


export default function Page() {

    const { todoId } = useParams() as Params;

    const {data, isLoading,
        error
    } = useQuery<TodoFull, Error>({
        queryKey : ["fetchTodoById", todoId],
        queryFn: () => fetchTodo(todoId)

    })

    if(error || !data){
        return <div>{error ? error.name : "An error occurred"}</div>
    }
    if (isLoading){
        return <div>Loading...</div>
    }

    return (
        <TodoDetail todo={data}></TodoDetail>
    );

}


async function fetchTodo(id: string): Promise<TodoFull> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/todos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch todo');
    return response.json();
}