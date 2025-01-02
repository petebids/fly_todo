import Link from "next/link";
import AddChecklistItemForm from "@/app/components/AddChecklistItemForm";


export default function TodoDetail({todo} : {todo : TodoFull}) {
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
            <AddChecklistItemForm todoId={todo.id}></AddChecklistItemForm>
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
    )
}