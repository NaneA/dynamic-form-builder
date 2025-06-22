import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // you’ll add your `formBuilder` slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
