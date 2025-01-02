interface Page<T> {
    content: T[]
}

interface Todo {
    id: string
    name: string
    completed: boolean
}

interface TodoFull {
    id: string
    name: string
    completed: boolean
    details: string
    checklistItems: Item[]
}

interface Item {
    details: string
    completed: boolean
}


interface AddChecklistItemRequest{
    details: string
}
