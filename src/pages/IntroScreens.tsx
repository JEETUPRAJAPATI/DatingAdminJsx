import React, { useState } from 'react';
import { GripVertical, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface IntroScreen {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

const dummyScreens: IntroScreen[] = [
  {
    id: '1',
    title: 'Welcome to Dating App',
    description: 'Find your perfect match with our intelligent matching system.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    order: 1,
    active: true,
  },
  {
    id: '2',
    title: 'Discover People',
    description: 'Browse through profiles and find people who share your interests.',
    image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800&h=600&fit=crop',
    order: 2,
    active: true,
  },
  {
    id: '3',
    title: 'Start Chatting',
    description: 'Connect with your matches and start meaningful conversations.',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop',
    order: 3,
    active: true,
  },
];

export function IntroScreens() {
  const [screens, setScreens] = useState(dummyScreens);

  const moveScreen = (fromIndex: number, toIndex: number) => {
    const newScreens = [...screens];
    const [movedScreen] = newScreens.splice(fromIndex, 1);
    newScreens.splice(toIndex, 0, movedScreen);
    
    // Update order numbers
    newScreens.forEach((screen, index) => {
      screen.order = index + 1;
    });
    
    setScreens(newScreens);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Intro Screens</h1>
        <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          <Plus className="h-4 w-4" />
          Add Screen
        </button>
      </div>

      <div className="space-y-4">
        {screens.map((screen, index) => (
          <div
            key={screen.id}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start gap-6">
              <button
                className="mt-2 cursor-move text-gray-400 hover:text-gray-600"
                title="Drag to reorder"
              >
                <GripVertical className="h-5 w-5" />
              </button>

              <div className="relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <img
                  src={screen.image}
                  alt={screen.title}
                  className="h-full w-full object-cover"
                />
                <button className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={screen.title}
                    onChange={() => {}}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={screen.description}
                    onChange={() => {}}
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={screen.active}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
        <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Plus className="h-5 w-5" />
          Add another screen
        </button>
      </div>
    </div>
  );
}