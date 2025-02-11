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
  const [error, setError] = useState(null) // state для ошибки (необязательно)

  useEffect(() => {
    axios
      .get<ListPageTypes[]>('http://localhost:3000/items')
      .then((response) => {
        const data = response.data
        console.log(data)
        setItems(data) // сохраняем объявления в state
      })
      .catch((error) => {
        console.error('Error fetching items:', error)
        setError(error.message) // сохраняем текст ошибки (необязательно)
      })
  }, [])

  return (
    <div>
      <h1>Список объявлений</h1>

      {/* Если ошибка — выведем её */}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      {/* Если объявлений нет, напишем, что пока ничего нет */}
      {items.length === 0 && !error && <p>Пока нет объявлений.</p>}

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
