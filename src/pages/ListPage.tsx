import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { ListPageTypes } from '../App'

interface ListPageProps {
  items: ListPageTypes[]
  loading: boolean
  error: string | null
}

const ListPage: React.FC<ListPageProps> = ({ items, loading, error }) => {
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(0)

  // Вычисляем срез текущих элементов
  const offset = currentPage * itemsPerPage
  const currentItems = items.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(items.length / itemsPerPage)

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

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
        {currentItems.map((item) => (
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

      {items.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={'«'}
          nextLabel={'»'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
        />
      )}
    </div>
  )
}

export default ListPage
