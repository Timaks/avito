import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'

import FormPage from './pages/FormPage'
import ListPage from './pages/ListPage'
import ItemPage from './pages/ItemPage'
import NotFound from './pages/NotFound'

// Интерфейс, соответствующий данным, возвращаемым сервером
export interface ListPageTypes {
  id: number
  name: string
  description: string
  location: string
  type: 'Недвижимость' | 'Авто' | 'Услуги'
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

  const addItem = (newItem: ListPageTypes) => {
    // Добавляем новое объявление в конец массива
    setItems((prevItems) => [...prevItems, newItem])
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<ListPage items={items} loading={loading} error={error} />}
        />
        <Route path='/form' element={<FormPage addItem={addItem} />} />
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
