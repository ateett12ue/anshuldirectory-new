import { useState, useRef } from 'react';
import { usePerson } from '../context/PersonContext';

const PersonList = () => {
  const { people, deletePerson } = usePerson();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPeople = people.filter((person) =>
    [person.firstName, person.lastName, person.email, person.phone, person.city, person.state]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setPersonToDelete(id);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = () => {
    if (personToDelete) deletePerson(personToDelete);
    setIsDeleting(false);
    setPersonToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setPersonToDelete(null);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 animate-fade-in">👥 Person Directory</h2>

        {/* Animated Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full transition-all duration-300 overflow-hidden w-fit focus-within:ring-2 focus-within:ring-blue-500">
            <button onClick={toggleSearch} className="p-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className={`bg-transparent text-white placeholder-gray-400 outline-none transition-all duration-300 ease-in-out ${
                isSearchOpen ? 'w-64 px-3 py-2 opacity-100' : 'w-0 px-0 py-0 opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto animate-fade-in">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-xl ring-1 ring-gray-700 ring-opacity-5 rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Location', 'Actions'].map((heading, i) => (
                      <th key={i} className="px-4 py-3 text-center text-sm font-semibold text-white">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {filteredPeople.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 text-lg">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-5xl animate-pulse">📭</span>
                          <p>No people to display</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPeople.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-700 transition duration-200">
                        <td className="px-4 py-4 text-sm text-center text-white font-medium">
                          {person.firstName} {person.lastName}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-300">{person.email}</td>
                        <td className="px-4 py-4 text-sm text-center text-gray-300">{person.phone}</td>
                        <td className="px-4 py-4 text-sm text-center text-gray-300">
                          {person.city}, {person.state}
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <button
                            onClick={() => handleDeleteClick(person.id)}
                            className="text-red-400 hover:text-red-300 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && personToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-center animate-scale-in">
              <h3 className="text-white font-semibold text-lg mb-4">
                Are you sure you want to delete this person?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-md">
                  Yes, Delete
                </button>
                <button onClick={handleDeleteCancel} className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonList;
