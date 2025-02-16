import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { ListPageTypes } from '../../App'

interface CurrentItemState {
  item: ListPageTypes | null
  loading: boolean
  error: string | null
}

const initialState: CurrentItemState = {
  item: null,
  loading: false,
  error: null,
}

// Thunk для получения объявления по id
export const fetchItem = createAsyncThunk<
  ListPageTypes,
  string,
  { rejectValue: string }
>('currentItem/fetchItem', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get<ListPageTypes>(
      `http://localhost:3000/items/${id}`
    )
    return response.data
  } catch (err) {
    let errorMsg = 'Произошла неизвестная ошибка.'
    if (err instanceof AxiosError && err.response) {
      errorMsg = `Ошибка загрузки: ${err.response.status} ${err.response.statusText}`
    }
    return rejectWithValue(errorMsg)
  }
})

// Thunk для удаления объявления по id
export const deleteItemThunk = createAsyncThunk<
  string, // возвращаем id удалённого объявления
  string,
  { rejectValue: string }
>('currentItem/deleteItem', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:3000/items/${id}`)
    return id
  } catch (err) {
    return rejectWithValue('Ошибка при удалении объявления')
  }
})

const currentItemSlice = createSlice({
  name: 'currentItem',
  initialState,
  reducers: {
    clearItem: (state) => {
      state.item = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка получения объявления
      .addCase(fetchItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchItem.fulfilled,
        (state, action: PayloadAction<ListPageTypes>) => {
          state.loading = false
          state.item = action.payload
        }
      )
      .addCase(fetchItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при загрузке объявления'
      })
      // Обработка удаления объявления
      .addCase(deleteItemThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteItemThunk.fulfilled, (state) => {
        state.loading = false
        // После удаления очищаем текущее объявление
        state.item = null
      })
      .addCase(deleteItemThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Ошибка при удалении объявления'
      })
  },
})

export const { clearItem } = currentItemSlice.actions
export default currentItemSlice.reducer
