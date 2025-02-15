// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'

import FormPage from './pages/FormPage'
import ListPage from './pages/ListPage'
import ItemPage from './pages/ItemPage'
import NotFound from './pages/NotFound'
import './index.css'

export interface ListPageTypes {
  id: number
  name: string
  description: string
  location: string
  type: 'Недвижимость' | 'Авто' | 'Услуги'
  image?: string
  // поля для недвижимости
  propertyType?: string
  area?: number
  rooms?: number
  price?: number
  // поля для авто
  brand?: string
  model?: string
  year?: number
  mileage?: number
  // поля для услуг
  serviceType?: string
  experience?: string
  cost?: number
}

function App() {
  const [items, setItems] = useState<ListPageTypes[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<ListPageTypes[]>(
        'http://localhost:3000/items'
      )
      setItems(response.data)
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          setError(
            `Ошибка загрузки: ${err.response.status} ${err.response.statusText}`
          )
        } else {
          setError(
            'Не удалось загрузить объявления. Проверьте ваше подключение или сервер.'
          )
        }
      } else {
        setError('Произошла неизвестная ошибка.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Функция для добавления нового объявления
  const addItem = (newItem: ListPageTypes) => {
    setItems((prevItems) => [...prevItems, newItem])
  }

  // Функция для обновления объявления
  const updateItem = (updatedItem: ListPageTypes) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<ListPage items={items} loading={loading} error={error} />}
        />
        {/* Передаём updateItem в форму редактирования */}
        <Route
          path='/form/:id'
          element={<FormPage addItem={addItem} updateItem={updateItem} />}
        />
        <Route path='/form' element={<FormPage addItem={addItem} />} />
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
