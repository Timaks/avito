import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination/Pagination'
import Filters from '../components/Filters/Filters'
import { ListPageTypes } from '../App'

interface ListPageProps {
  items: ListPageTypes[]
  loading: boolean
  error: string | null
}

const ListPage: React.FC<ListPageProps> = ({ items, loading, error }) => {
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(0)

  // Состояния фильтров
  const [selectedCategory, setSelectedCategory] = useState('')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('')
  const [minAreaFilter, setMinAreaFilter] = useState('')
  const [minRoomsFilter, setMinRoomsFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [modelFilter, setModelFilter] = useState('')
  const [minYearFilter, setMinYearFilter] = useState('')
  const [maxMileageFilter, setMaxMileageFilter] = useState('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('')
  const [minCostFilter, setMinCostFilter] = useState('')

  // Состояние поиска по названию
  const [searchQuery, setSearchQuery] = useState('')

  // Функция сброса фильтров
  const clearFilters = () => {
    setSelectedCategory('')
    setPropertyTypeFilter('')
    setMinAreaFilter('')
    setMinRoomsFilter('')
    setMaxPriceFilter('')
    setBrandFilter('')
    setModelFilter('')
    setMinYearFilter('')
    setMaxMileageFilter('')
    setServiceTypeFilter('')
    setMinCostFilter('')
  }

  // Сбрасываем текущую страницу при изменении фильтров или поискового запроса
  useEffect(() => {
    setCurrentPage(0)
  }, [
    selectedCategory,
    propertyTypeFilter,
    minAreaFilter,
    minRoomsFilter,
    maxPriceFilter,
    brandFilter,
    modelFilter,
    minYearFilter,
    maxMileageFilter,
    serviceTypeFilter,
    minCostFilter,
    searchQuery,
  ])

  // Фильтрация элементов
  const filteredItems = items.filter((item) => {
    let match = true

    // Поиск по названию
    if (
      searchQuery &&
      item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1
    ) {
      match = false
    }

    if (selectedCategory && item.type !== selectedCategory) {
      match = false
    }

    if (selectedCategory === 'Недвижимость') {
      if (
        propertyTypeFilter &&
        (!item.propertyType ||
          item.propertyType
            .toLowerCase()
            .indexOf(propertyTypeFilter.toLowerCase()) === -1)
      ) {
        match = false
      }
      if (
        minAreaFilter &&
        item.area !== undefined &&
        item.area < parseFloat(minAreaFilter)
      ) {
        match = false
      }
      if (
        minRoomsFilter &&
        item.rooms !== undefined &&
        item.rooms < parseInt(minRoomsFilter)
      ) {
        match = false
      }
      if (
        maxPriceFilter &&
        item.price !== undefined &&
        item.price > parseFloat(maxPriceFilter)
      ) {
        match = false
      }
    }

    if (selectedCategory === 'Авто') {
      if (
        brandFilter &&
        (!item.brand ||
          item.brand.toLowerCase().indexOf(brandFilter.toLowerCase()) === -1)
      ) {
        match = false
      }
      if (
        modelFilter &&
        (!item.model ||
          item.model.toLowerCase().indexOf(modelFilter.toLowerCase()) === -1)
      ) {
        match = false
      }
      if (
        minYearFilter &&
        item.year !== undefined &&
        item.year < parseInt(minYearFilter)
      ) {
        match = false
      }
      if (
        maxMileageFilter &&
        item.mileage !== undefined &&
        item.mileage > parseInt(maxMileageFilter)
      ) {
        match = false
      }
    }

    if (selectedCategory === 'Услуги') {
      if (
        serviceTypeFilter &&
        (!item.serviceType ||
          item.serviceType
            .toLowerCase()
            .indexOf(serviceTypeFilter.toLowerCase()) === -1)
      ) {
        match = false
      }
      if (
        minCostFilter &&
        item.cost !== undefined &&
        item.cost < parseFloat(minCostFilter)
      ) {
        match = false
      }
    }

    return match
  })

  // Пагинация после фильтрации
  const offset = currentPage * itemsPerPage
  const currentItems = filteredItems.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage)

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

      <div className='main-content'>
        <div className='sidebar'>
          <Filters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            propertyTypeFilter={propertyTypeFilter}
            setPropertyTypeFilter={setPropertyTypeFilter}
            minAreaFilter={minAreaFilter}
            setMinAreaFilter={setMinAreaFilter}
            minRoomsFilter={minRoomsFilter}
            setMinRoomsFilter={setMinRoomsFilter}
            maxPriceFilter={maxPriceFilter}
            setMaxPriceFilter={setMaxPriceFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            modelFilter={modelFilter}
            setModelFilter={setModelFilter}
            minYearFilter={minYearFilter}
            setMinYearFilter={setMinYearFilter}
            maxMileageFilter={maxMileageFilter}
            setMaxMileageFilter={setMaxMileageFilter}
            serviceTypeFilter={serviceTypeFilter}
            setServiceTypeFilter={setServiceTypeFilter}
            minCostFilter={minCostFilter}
            setMinCostFilter={setMinCostFilter}
            clearFilters={clearFilters}
          />
        </div>
        <div className='list-container'>
          {/* Поле поиска по названию */}
          <div className='search-bar'>
            <input
              type='text'
              placeholder='Поиск по названию'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {loading && <p>Загрузка...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {filteredItems.length === 0 && !loading && !error && (
            <p>Пока нет объявлений.</p>
          )}
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

          {filteredItems.length > itemsPerPage && (
            <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ListPage
