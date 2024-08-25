import { create } from 'zustand';
import { User } from '../models/user';

type AppState = {
  isAuthenticated: boolean;
  user: User;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User) => void;
  resetState: () => void;
};

const getInitialState = () => {
  return {
    isAuthenticated: false,
  } as AppState;
};

export const useAppStore = create<AppState>((set) => ({
  ...getInitialState(),
  resetState: () =>
    set((state) => ({
      ...state,
      ...getInitialState()
    })),
  setUser: (user: User) => {
    set((state) => ({...state, user}));
  },
  setAuthenticated: (isAuthenticated: boolean) => {
    set((state) => ({ ...state, isAuthenticated }));
  },
}));


window['appStore'] = window['appStore'] || {};
window['appStore'].useAppStore = useAppStore;