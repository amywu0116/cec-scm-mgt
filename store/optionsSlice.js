const initialState = {
  zipCity: [],
  options: {},
};

export const createOptionsSlice = (set) => ({
  ...initialState,
  updateOptions: (data) => set((state) => ({ ...state, ...data })),
});
