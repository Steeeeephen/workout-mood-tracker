import React from 'react'
import axios from "axios";

const DeleteEntryModal = ({entry,onClose,onSuccess}) => {

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/entries/${entry.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onSuccess();

        } catch (err) {
            console.error('Error deleting entry.', err)
        }
    }



    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-100">
                <h1>Are you sure???</h1>
                <button onClick={handleConfirmDelete}>Yes, Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}
export default DeleteEntryModal
