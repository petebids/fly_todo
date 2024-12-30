import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useForm} from 'react-hook-form';
import React from "react";

interface CreateTodoInput {
    name: string;
};


async function createTodo(createTodoForm: CreateTodoInput) {
    const res = await fetch('http://localhost:8080/v1/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTodoForm),
    });

    if (!res.ok) {
        throw new Error('Failed to create todo');
    }
    return res.json() as Promise<Todo>;
}

export default function CreateTodoForm() {
    const {register, handleSubmit, reset} = useForm<CreateTodoInput>({
        defaultValues: {
            name: '',
        },
    });

    const queryClient = useQueryClient();

    const mutation = useMutation<Todo, Error, CreateTodoInput>(
        {
            mutationFn: createTodo,


        }
    )

    const onSubmit = (form: CreateTodoInput) => {
        mutation.mutate(form, {
                onSuccess: () => {
                    reset()
                   queryClient.refetchQueries()
                    }
            }
        );
    };


    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register('name', {required: true})}
                placeholder="Enter todo name"
                style={{color: 'black'}}
            />
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : 'Submit'}
            </button>

            {mutation.isError && <p style={{color: 'red'}}>{mutation.error.message}</p>}


        </form>

    );

}
