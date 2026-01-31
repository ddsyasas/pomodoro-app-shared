import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import type { TaskStore, Task, TaskCategory, TaskFilter } from '../types';
import { TASKS_STORAGE_KEY } from '../constants/config';

// Generate unique ID
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            // State
            tasks: [],
            filter: 'active' as TaskFilter,
            categoryFilter: null,
            activeTaskId: null,

            // Actions
            addTask: (title: string, category: TaskCategory, dueDate: string | null) => {
                const newTask: Task = {
                    id: generateId(),
                    title,
                    category,
                    dueDate,
                    completed: false,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    tasks: [newTask, ...state.tasks],
                }));
            },

            toggleTask: (id: string) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completed: !task.completed } : task
                    ),
                }));
            },

            deleteTask: (id: string) => {
                const { activeTaskId } = get();
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                    activeTaskId: activeTaskId === id ? null : activeTaskId,
                }));
            },

            updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates } : task
                    ),
                }));
            },

            setFilter: (filter: TaskFilter) => {
                set({ filter });
            },

            setCategoryFilter: (category: TaskCategory | null) => {
                set({ categoryFilter: category });
            },

            setActiveTask: (id: string | null) => {
                set({ activeTaskId: id });
            },

            clearCompleted: () => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => !task.completed),
                }));
            },
        }),
        {
            name: TASKS_STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                tasks: state.tasks,
                activeTaskId: state.activeTaskId,
            }),
        }
    )
);

// Selector hooks for better performance - using useMemo to prevent infinite loops
export const useActiveTasks = () => {
    const tasks = useTaskStore(useShallow((state) => state.tasks));
    const categoryFilter = useTaskStore((state) => state.categoryFilter);

    return useMemo(() => {
        let filtered = tasks.filter((task) => !task.completed);
        if (categoryFilter) {
            filtered = filtered.filter((task) => task.category === categoryFilter);
        }
        return filtered;
    }, [tasks, categoryFilter]);
};

export const useCompletedTasks = () => {
    const tasks = useTaskStore(useShallow((state) => state.tasks));
    const categoryFilter = useTaskStore((state) => state.categoryFilter);

    return useMemo(() => {
        let filtered = tasks.filter((task) => task.completed);
        if (categoryFilter) {
            filtered = filtered.filter((task) => task.category === categoryFilter);
        }
        return filtered;
    }, [tasks, categoryFilter]);
};

export const useActiveTask = () => {
    const tasks = useTaskStore(useShallow((state) => state.tasks));
    const activeTaskId = useTaskStore((state) => state.activeTaskId);

    return useMemo(() => {
        if (!activeTaskId) return null;
        return tasks.find((task) => task.id === activeTaskId) || null;
    }, [tasks, activeTaskId]);
};
