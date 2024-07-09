const initialState = {
  logistics: [],
  options: {},
  zipCity: [],
};

export const createOptionsSlice = (set) => ({
  ...initialState,
  updateOptions: (data) => set((state) => data),
});
