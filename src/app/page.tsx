'use client';

import { useState } from 'react';
import { CreateListButton } from '@/components/CreateListButton';
import { ListCard } from '@/components/ListCard';
import { CreateListModal } from '@/components/CreateListModal';
import { List } from '@/types';


export default function HomePage() {
  const [lists, setLists] = useState<List[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateList = (name: string) => {
    const newList: List = {
      id: crypto.randomUUID(),
      name,
      userId: ''
    };
    setLists(prev => [...prev, newList]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              My Lists
            </h1>
            <p className="text-slate-600 text-lg">
              Create and manage your personal lists
            </p>
          </header>

          <div className="mb-8">
            <CreateListButton onClick={() => setIsModalOpen(true)} />
          </div>

          {lists.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-4">
              </div>
              <h3 className="text-xl font-medium text-slate-600 mb-2">
                No lists yet
              </h3>
              <p className="text-slate-500">
                Create your first list to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateList={handleCreateList}
      />
    </div>
  );
}