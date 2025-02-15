import React from 'react'
import { Link } from 'react-router-dom'
import { ListPageTypes } from '../App'

interface ListPageProps {
  items: ListPageTypes[]
  loading: boolean
  error: string | null
}

const ListPage: React.FC<ListPageProps> = ({ items, loading, error }) => {
  return (
    <div>
      <h1>Список объявлений</h1>
      <Link to='/form'>
        <button>Разместить объявление</button>
      </Link>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {items.length === 0 && !loading && !error && <p>Пока нет объявлений.</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListPage
