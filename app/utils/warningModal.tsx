'use client';

import { useEffect, useState } from "react";
import { Post } from "../types/types";

type Props = {
    isOpen: boolean;
    post: Post;
    onClose: () => void;
    onDelete: (postId: number) => void;
}

export default function WarningModal({isOpen, post, onClose, onDelete}: Props) {
    

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl mb-4">Are you sure you want to delete this post?</h2> 
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDelete(post.id )}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}