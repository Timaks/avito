import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import FormPage from './FormPage'

// Определение типа для объявлений
interface ListPageTypes {
  id: number
  name: string
  description: string
  location: string
  type: 'REAL_ESTATE' | 'AUTO' | 'SERVICES' // Это более точный тип для 'type'
}

const ListPage: React.FC = () => {
  const [items, setItems] = useState<ListPageTypes[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Функция для добавления нового объявления
  const addItem = (newItem: ListPageTypes) => {
    setItems((prevItems) => [...prevItems, newItem])
  }
  // Функция для загрузки данных с сервера
  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<ListPageTypes[]>(
        'http://localhost:3000/items'
      )
      setItems(response.data) // Обновляем список объявлений
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching items:', error)
        if (error.response) {
          setError(
            `Ошибка загрузки: ${error.response.status} ${error.response.statusText}`
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

  // Загружаем объявления при первом рендере
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/items')
        setItems(response.data)
      } catch (error) {
        console.error('Ошибка при загрузке объявлений', error)
      }
    }
    fetchItems()
  }, [])

  return (
    <div>
      <h1>Список объявлений</h1>
      <Link to="/form">
        <button>Разместить объявление</button>
      </Link>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {items.length === 0 && !loading && !error && <p>Пока нет объявлений.</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/item/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListPage
