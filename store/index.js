import { create } from "zustand";
import { createUserSlice } from "./userSlice";
import { createOptionsSlice } from "./optionsSlice";

export const useBoundStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createOptionsSlice(...a),
}));
