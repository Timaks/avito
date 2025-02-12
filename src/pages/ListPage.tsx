import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface ListPageTypes {
  id: number
  name: string
  description: string
  location: string
  type: string
}

function ListPage() {
  const [items, setItems] = useState<ListPageTypes[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<ListPageTypes[]>(
          'http://localhost:3000/items'
        )
        setItems(response.data) // сохраняем объявления в state
      } catch (error) {
        console.error('Error fetching items:', error)
        setError('Не удалось загрузить объявления. Попробуйте позже.')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  return (
    <div>
      <h1>Список объявлений</h1>
      <Link to='/form'>
        <button>Разместить объявление</button>
      </Link>
      {/* Если в процессе загрузки - покажем загрузочный индикатор */}
      {loading && <p>Загрузка...</p>}

      {/* Если ошибка — выведем её */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Если объявлений нет, напишем, что пока ничего нет */}
      {items.length === 0 && !loading && <p>Пока нет объявлений.</p>}

      <ul>
        {/* Перебираем массив объявлений и рендерим списком */}
        {items.map((item) => (
          <li key={item.id}>
            {/* Например, выводим name объявления, 
                и/или делаем ссылку на детальный просмотр */}
            <Link to={`/item/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListPage
