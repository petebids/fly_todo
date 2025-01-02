'use client'
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import React from "react";

export default function AddChecklistItemForm({todoId}: { todoId: string }) {
    const {register, handleSubmit, reset} = useForm<AddChecklistItemRequest>({
        defaultValues: {
            details: ''

        }
    })

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addChecklistItem,
        onSuccess: async () => {
            await queryClient.refetchQueries();
            reset();
        }
    })

    const onsubmit = (req: AddChecklistItemRequest) => {
        mutation.mutate({
            todoId: todoId,
            req: req
        })
    }
    return (
        <form onSubmit={handleSubmit(onsubmit)}>
            <input {...register('details', {required: true})}
                   placeholder={"details of checklist item"}
                   style={{color: 'black'}}></input>
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : 'Submit'}
            </button>

            {mutation.isError && <p style={{color: 'red'}}>{mutation.error.message}</p>}
        </form>
    )
}

async function addChecklistItem(input: AddChecklistItemInput) {
    await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/todos/${input.todoId}/checklist`, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input.req),
        method: 'PUT',
    })
}


interface AddChecklistItemInput {
    todoId: string,
    req: AddChecklistItemRequest
}