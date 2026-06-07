import React, { useState } from 'react';
import { useFetchEntries } from '../context/FetchEntriesContext.tsx';

const SearchFilter = () => {
  const { entries } = useFetchEntries();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <button
        className="p-3 py-2 w-full bg-teal-600 text-white  hover:bg-teal-700 transition-colors shadow-md"
        onClick={() => setIsSearchOpen(true)}
      >
        Search
      </button>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 flex flex-col z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-auto my-10 h-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-bold text-2xl text-center">
                Search and Filter
              </h1>
              <button onClick={() => setIsSearchOpen(false)}>
                <img
                  className="w-12 h-12"
                  src="/close-circle-svgrepo-com.svg"
                  alt="close search button"
                />
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4"
                id="search-input"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const results = entries.filter((entry) =>
                    entry.content.toLowerCase().includes(searchTerm),
                  );
                  const resultsDiv = document.getElementById(
                    'search-results',
                  ) as HTMLDivElement;
                }}
              />

              <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4">
                <option value="">Select Entry Type</option>
                <option value="PRE_WORKOUT">Pre Workout</option>
                <option value="WORKOUT">Workout</option>
                <option value="POST_WORKOUT">Post Workout</option>
                <option value="MISC">Misc</option>
              </select>

              <input
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none mb-4"
                type="date"
              />

              <div>
                <h2 className="text-lg font-bold">Results:</h2>
              </div>

              <div className="flex flex-col gap-4" id="search-results">
                {entries.map(
                  (entry) =>
                    entry.content.toLowerCase().includes('search') &&
                    entry.content,
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchFilter;
