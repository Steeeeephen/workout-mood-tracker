import React, { useState } from 'react';
import { format } from 'date-fns';
import api from '../config/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

const EntryModal = ({ entry, onClose, onSuccess, defaultDate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    entry_datetime: entry?.entry_datetime
      ? format(new Date(entry.entry_datetime), "yyyy-MM-dd'T'HH:mm")
      : defaultDate
        ? `${defaultDate}T00:00`
        : '', // ← Use defaultDate if creating
    entry_type: entry?.entry_type || '',
    mood: entry?.mood?.toString() || '',
    content: entry?.content || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      // Get the user token
      const token = localStorage.getItem('token');

      const payload = {
        entry_datetime: new Date(formData.entry_datetime),
        entry_type: formData.entry_type,
        mood: parseInt(formData.mood),
        content: formData.content,
      };

      if (entry) {
        await api.patch(`/entries/${entry.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // CREATE new entry
        await api.post('entries', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      showSuccess('Entry saved!');
      onSuccess();
    } catch (err) {
      showError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full shadow-zinc-950">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>{' '}
          <button onClick={onClose} className="font-extrabold cursor-pointer">
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <input
              type="datetime-local"
              value={formData.entry_datetime}
              onChange={(e) =>
                setFormData({ ...formData, entry_datetime: e.target.value })
              }
            />

            <select
              name="entryType"
              id="entryType"
              value={formData.entry_type}
              onChange={(e) =>
                setFormData({ ...formData, entry_type: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Entry Type
              </option>
              <option value="PRE_WORKOUT">Pre Workout</option>
              <option value="WORKOUT">Workout</option>
              <option value="POST_WORKOUT">Post Workout</option>
              <option value="MISC">Misc</option>
            </select>
          </div>
          <div>
            <fieldset className="flex border p-2 rounded">
              <legend>Mood Rating</legend>

              <div className="mr-4">
                <input
                  type="radio"
                  id="1"
                  name="mood"
                  value="1"
                  checked={formData.mood === '1'}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                />
                <label htmlFor="1">1</label>
              </div>

              <div className="mr-4">
                <input
                  type="radio"
                  id="2"
                  name="mood"
                  value="2"
                  checked={formData.mood === '2'}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                />
                <label htmlFor="2">2</label>
              </div>

              <div className="mr-4">
                <input
                  type="radio"
                  id="3"
                  name="mood"
                  value="3"
                  checked={formData.mood === '3'}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                />
                <label htmlFor="3">3</label>
              </div>

              <div className="mr-4">
                <input
                  type="radio"
                  id="4"
                  name="mood"
                  value="4"
                  checked={formData.mood === '4'}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                />
                <label htmlFor="4">4</label>
              </div>

              <div className="mr-4">
                <input
                  type="radio"
                  id="5"
                  name="mood"
                  value="5"
                  checked={formData.mood === '5'}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                />
                <label htmlFor="5">5</label>
              </div>
            </fieldset>
          </div>

          <div className=" rounded-2xl">
            <label htmlFor="content">Notes</label>
            <textarea
              className="border-gray-300 bg-zinc-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4 p-3 w-full"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              name="content"
              id="content"
              rows="10"
            />
          </div>
          <button
            className="w-full px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default EntryModal;
