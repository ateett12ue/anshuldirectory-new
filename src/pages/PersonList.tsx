import { usePerson } from '../context/PersonContext';
import { useState } from 'react';

const PersonList = () => {
  const { people, deletePerson } = usePerson();
  const [isDeleting, setIsDeleting] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPersonToDelete(id);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = () => {
    if (personToDelete) {
      deletePerson(personToDelete);
    }
    setIsDeleting(false);
    setPersonToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setPersonToDelete(null);
  };

  return (
    <div className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-white animate-fade-in">
          👥 Person Directory
        </h2>

        <div className="overflow-x-auto animate-fade-in">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-xl ring-1 ring-gray-700 ring-opacity-5 rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
                  <tr>
                    <th className="w-[20%] px-4 py-3 text-center text-sm font-semibold text-white">
                      Name
                    </th>
                    <th className="w-[25%] px-4 py-3 text-center text-sm font-semibold text-white">
                      Email
                    </th>
                    <th className="w-[20%] px-4 py-3 text-center text-sm font-semibold text-white">
                      Phone
                    </th>
                    <th className="w-[25%] px-4 py-3 text-center text-sm font-semibold text-white">
                      Location
                    </th>
                    <th className="w-[10%] px-4 py-3 text-center text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {people.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 text-lg">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <span className="text-5xl animate-pulse">📭</span>
                          <p className="text-xl font-medium">No people to display</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    people.map((person) => (
                      <tr
                        key={person.id}
                        className="hover:bg-gray-700 transition duration-200"
                      >
                        <td className="px-4 py-4 text-sm text-center font-medium text-white">
                          {person.firstName} {person.lastName}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-300">
                          {person.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-300">
                          {person.phone}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-300">
                          {person.city}, {person.state}
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <button
                            onClick={() => handleDeleteClick(person.id)}
                            className="text-red-400 hover:text-red-300 transition font-semibold"
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
      </div>

      {isDeleting && personToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition duration-300">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-center animate-scale-in">
            <h3 className="text-lg text-white font-semibold mb-4">
              Are you sure you want to delete this person?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-400 transition text-white py-2 px-4 rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-600 hover:bg-gray-500 transition text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonList;
