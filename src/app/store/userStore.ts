import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CurrentUserStore {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useCurrentUserStore = create<CurrentUserStore>()(
  persist(
    set => ({
      user: {} as any,
      setUser: user => set({ user }),
      clearUser: () => set({ user: {} as any }),
    }),
    {
      name: 'currentUser',
      storage: createJSONStorage(() => sessionStorage),
     
      merge: (persistedState, currentState) => ({ ...currentState, ...(persistedState as CurrentUserStore) }),
    },
  ),
);