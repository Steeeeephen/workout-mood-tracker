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
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Delete Entry?
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this entry? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Delete Entry
            </button>
          </div>
        </div>
      </div>
    );
}
export default DeleteEntryModal
