import { create } from "zustand";
import { createUserSlice } from "./userSlice";
import { createOptionsSlice } from "./optionsSlice";

export const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createOptionsSlice(...a),
}));
