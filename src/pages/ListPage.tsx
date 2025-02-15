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
    <div className='container'>
      <div className='header'>
        <h1>Список объявлений</h1>
        <Link to='/form' className='button'>
          Разместить объявление
        </Link>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {items.length === 0 && !loading && !error && <p>Пока нет объявлений.</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id} className='list-item'>
            <div className='item-preview'>
              <img
                src={
                  item.image
                    ? item.image
                    : 'https://azaliadecor.ru/upload/iblock/5c7/pya5k5qetqhcd2lm4finiaulj4hjv7pq.jpg'
                }
                alt={item.name}
                className='item-image'
              />
              <div className='item-info'>
                <h2>{item.name}</h2>
                <p>Локация: {item.location}</p>
                <p>Категория: {item.type}</p>
              </div>
              <Link to={`/item/${item.id}`} className='button'>
                Открыть
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListPage
