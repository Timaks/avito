import React from 'react'
import './Filters.css'

interface FiltersProps {
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  // Фильтры для "Недвижимость"
  propertyTypeFilter: string
  setPropertyTypeFilter: (value: string) => void
  minAreaFilter: string
  setMinAreaFilter: (value: string) => void
  minRoomsFilter: string
  setMinRoomsFilter: (value: string) => void
  maxPriceFilter: string
  setMaxPriceFilter: (value: string) => void
  // Фильтры для "Авто"
  brandFilter: string
  setBrandFilter: (value: string) => void
  modelFilter: string
  setModelFilter: (value: string) => void
  minYearFilter: string
  setMinYearFilter: (value: string) => void
  maxMileageFilter: string
  setMaxMileageFilter: (value: string) => void
  // Фильтры для "Услуги"
  serviceTypeFilter: string
  setServiceTypeFilter: (value: string) => void
  minCostFilter: string
  setMinCostFilter: (value: string) => void
  // Функция сброса фильтров
  clearFilters: () => void
}

const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  propertyTypeFilter,
  setPropertyTypeFilter,
  minAreaFilter,
  setMinAreaFilter,
  minRoomsFilter,
  setMinRoomsFilter,
  maxPriceFilter,
  setMaxPriceFilter,
  brandFilter,
  setBrandFilter,
  modelFilter,
  setModelFilter,
  minYearFilter,
  setMinYearFilter,
  maxMileageFilter,
  setMaxMileageFilter,
  serviceTypeFilter,
  setServiceTypeFilter,
  minCostFilter,
  setMinCostFilter,
  clearFilters,
}) => {
  return (
    <div className='filters'>
      <label>
        Фильтр по категории:
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value=''>Все категории</option>
          <option value='Недвижимость'>Недвижимость</option>
          <option value='Авто'>Авто</option>
          <option value='Услуги'>Услуги</option>
        </select>
      </label>

      {selectedCategory === 'Недвижимость' && (
        <div className='additional-filters'>
          <label>
            Тип недвижимости:
            <input
              type='text'
              placeholder='Квартира, дом и т.д.'
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
            />
          </label>
          <label>
            Мин. площадь (кв.м):
            <input
              type='number'
              placeholder='Например, 50'
              value={minAreaFilter}
              onChange={(e) => setMinAreaFilter(e.target.value)}
            />
          </label>
          <label>
            Мин. кол-во комнат:
            <input
              type='number'
              placeholder='Например, 2'
              value={minRoomsFilter}
              onChange={(e) => setMinRoomsFilter(e.target.value)}
            />
          </label>
          <label>
            Макс. цена (руб.):
            <input
              type='number'
              placeholder='Например, 5000000'
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
            />
          </label>
        </div>
      )}

      {selectedCategory === 'Авто' && (
        <div className='additional-filters'>
          <label>
            Марка:
            <input
              type='text'
              placeholder='Например, Toyota'
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            />
          </label>
          <label>
            Модель:
            <input
              type='text'
              placeholder='Например, Camry'
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
            />
          </label>
          <label>
            Мин. год:
            <input
              type='number'
              placeholder='Например, 2010'
              value={minYearFilter}
              onChange={(e) => setMinYearFilter(e.target.value)}
            />
          </label>
          <label>
            Макс. пробег (км):
            <input
              type='number'
              placeholder='Например, 200000'
              value={maxMileageFilter}
              onChange={(e) => setMaxMileageFilter(e.target.value)}
            />
          </label>
        </div>
      )}

      {selectedCategory === 'Услуги' && (
        <div className='additional-filters'>
          <label>
            Тип услуги:
            <input
              type='text'
              placeholder='Например, продажа'
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
            />
          </label>
          <label>
            Мин. стоимость (руб.):
            <input
              type='number'
              placeholder='Например, 500'
              value={minCostFilter}
              onChange={(e) => setMinCostFilter(e.target.value)}
            />
          </label>
        </div>
      )}

      <button className='button clear-filters' onClick={clearFilters}>
        Очистить фильтры
      </button>
    </div>
  )
}

export default Filters
