import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { Person, FormData } from '../types';

interface PersonContextType {
  people: Person[];
  addPerson: (data: FormData) => void;
  deletePerson: (id: string) => void;
}

const PersonContext = createContext<PersonContextType | undefined>(undefined);

export function PersonProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: people = [] } = useQuery<Person[]>({
    queryKey: ['people'],
    queryFn: () => {
      const storedPeople = localStorage.getItem('people');
      return storedPeople ? JSON.parse(storedPeople) : [];
    },
  });

  const addPersonMutation = useMutation<Person[], unknown, Person>({
    mutationFn: (newPerson) => {
      return new Promise<Person[]>((resolve) => {
        const updatedPeople = [...people, newPerson];
        localStorage.setItem('people', JSON.stringify(updatedPeople));
        resolve(updatedPeople);
      });
    },
    onSuccess: (updatedPeople) => {
      queryClient.setQueryData(['people'], updatedPeople);
    },
  });

  const deletePersonMutation = useMutation<Person[], unknown, string>({
    mutationFn: (id) => {
      return new Promise<Person[]>((resolve) => {
        const updatedPeople = people.filter((person) => person.id !== id);
        localStorage.setItem('people', JSON.stringify(updatedPeople));
        resolve(updatedPeople);
      });
    },
    onSuccess: (updatedPeople) => {
      queryClient.setQueryData(['people'], updatedPeople);
    },
  });

  const addPerson = (data: FormData) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      ...data,
    };
    addPersonMutation.mutate(newPerson);
  };

  const deletePerson = (id: string) => {
    deletePersonMutation.mutate(id);
  };

  return (
    <PersonContext.Provider value={{ people, addPerson, deletePerson }}>
      {children}
    </PersonContext.Provider>
  );
}

export function usePerson() {
  const context = useContext(PersonContext);
  if (context === undefined) {
    throw new Error('usePerson must be used within a PersonProvider');
  }
  return context;
} 