import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from '../redux/slices/itemsSlice'
import currentItemReducer from '../redux/slices/currentItemSlice'

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    currentItem: currentItemReducer,
  },
})

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
