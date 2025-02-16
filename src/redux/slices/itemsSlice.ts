import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { ListPageTypes } from '../../App'

interface ItemsState {
  items: ListPageTypes[]
  loading: boolean
  error: string | null
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
}

// Асинхронный thunk для загрузки объявлений
export const fetchItems = createAsyncThunk<
  ListPageTypes[],
  void,
  { rejectValue: string }
>('items/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<ListPageTypes[]>(
      'http://localhost:3000/items'
    )
    return response.data
  } catch (err) {
    let errorMsg = 'Произошла неизвестная ошибка.'
    if (err instanceof AxiosError) {
      if (err.response) {
        errorMsg = `Ошибка загрузки: ${err.response.status} ${err.response.statusText}`
      } else {
        errorMsg =
          'Не удалось загрузить объявления. Проверьте ваше подключение или сервер.'
      }
    }
    return rejectWithValue(errorMsg)
  }
})

// Новый thunk для создания объявления
export const createItem = createAsyncThunk<
  ListPageTypes,
  Omit<ListPageTypes, 'id'>,
  { rejectValue: string }
>('items/createItem', async (newItemData, { rejectWithValue }) => {
  try {
    const response = await axios.post<ListPageTypes>(
      'http://localhost:3000/items',
      newItemData
    )
    return response.data
  } catch (err) {
    let errorMsg = 'Произошла неизвестная ошибка.'
    if (err instanceof AxiosError) {
      if (err.response) {
        errorMsg = `Ошибка создания: ${err.response.status} ${err.response.statusText}`
      } else {
        errorMsg =
          'Не удалось создать объявление. Проверьте ваше подключение или сервер.'
      }
    }
    return rejectWithValue(errorMsg)
  }
})

// Новый thunk для обновления объявления
export const updateItemThunk = createAsyncThunk<
  ListPageTypes,
  ListPageTypes,
  { rejectValue: string }
>('items/updateItem', async (updatedItemData, { rejectWithValue }) => {
  try {
    const response = await axios.put<ListPageTypes>(
      `http://localhost:3000/items/${updatedItemData.id}`,
      updatedItemData
    )
    return response.data
  } catch (err) {
    let errorMsg = 'Произошла неизвестная ошибка.'
    if (err instanceof AxiosError) {
      if (err.response) {
        errorMsg = `Ошибка обновления: ${err.response.status} ${err.response.statusText}`
      } else {
        errorMsg =
          'Не удалось обновить объявление. Проверьте ваше подключение или сервер.'
      }
    }
    return rejectWithValue(errorMsg)
  }
})

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Синхронные экшены можно оставить на случай, если они понадобятся
    addItem: (state, action: PayloadAction<ListPageTypes>) => {
      state.items.push(action.payload)
    },
    updateItem: (state, action: PayloadAction<ListPageTypes>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchItems
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при загрузке данных'
      })
      // createItem
      .addCase(createItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при создании объявления'
      })
      // updateItemThunk
      .addCase(updateItemThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateItemThunk.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateItemThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при обновлении объявления'
      })
  },
})

export const { addItem, updateItem, deleteItem } = itemsSlice.actions
export default itemsSlice.reducer
