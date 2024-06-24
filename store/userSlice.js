import { persist } from "zustand/middleware";

const initialState = {
  user: {},
};

export const createUserSlice = persist(
  (set) => ({
    ...initialState,
    updateUser: (data) => set((state) => ({ user: data })),
  }),
  { name: "user-storage" }
);
