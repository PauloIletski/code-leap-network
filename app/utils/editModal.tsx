'use client'

import { useEffect, useState } from "react"
import { Post } from "../types/types"

type Props = {
    isOpen: boolean;
    post: Post | null;
    onClose: () => void;
    onSave: (updatedPost: Post) => void;
}


export default function EditModal({isOpen, post, onClose, onSave}: Props) {
    const [form,setForm] = useState<Post|null>(post)
    useEffect(() => {
        setForm(post)
    }, [post])

    if (!isOpen || !form) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl mb-4">Edit Post</h2>
                 <fieldset className="mt-4">
              <label htmlFor="title" className=" text-sm text-black">
                Title</label>
                <input 
                    className="border border-gray-300 rounded p-2 w-full"
                    type="text"
                    id="title"
                    value={form?.title || ""}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                />
            </fieldset>
            <fieldset className="mt-4">
              <label htmlFor="content" className=" text-sm text-black">
                Content</label>
                <input 
                    className="border border-gray-300 rounded p-2 w-full"
                    type="text"
                    id="content"
                    value={form?.content || ""}
                    onChange={(e) => setForm({...form, content: e.target.value})}
                />
            </fieldset >
            <div className="mt-4 flex justify-end">
                <button
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => onSave(form!)}>
                        Edit
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={onClose}>
                        Cancel
                </button>
            </div> 
            </div>
                         
        </div>
    )
}