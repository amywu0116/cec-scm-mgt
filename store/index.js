import { create } from "zustand";
import { createUserSlice } from "./userSlice";

export const useBoundStore = create((...a) => ({
  ...createUserSlice(...a),
}));
