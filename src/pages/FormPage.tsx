import React, { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { ListPageTypes } from '../App'

interface FeedbackFormData {
  name: string
  description: string
  location: string
  type: '' | 'realty' | 'auto' | 'services'
  image: string
  propertyType?: string
  area?: number
  rooms?: number
  price?: number
  brand?: string
  model?: string
  year?: number
  mileage?: number
  serviceType?: string
  experience?: string
  cost?: number
}

interface FormPageProps {
  addItem: (newItem: ListPageTypes) => void
}

const FormPage: React.FC<FormPageProps> = ({ addItem }) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    description: '',
    location: '',
    type: '',
    image: '',
  })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedData = localStorage.getItem('draftFormData')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('draftFormData', JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : 0,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0].name,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Преобразуем значение type в формат, который ожидает сервер
    let serverType: 'Недвижимость' | 'Авто' | 'Услуги' = 'Недвижимость'
    switch (formData.type) {
      case 'realty':
        serverType = 'Недвижимость'
        break
      case 'auto':
        serverType = 'Авто'
        break
      case 'services':
        serverType = 'Услуги'
        break
      default:
        setError('Некорректный тип объявления')
        return
    }

    // Проверяем обязательные поля
    if (!formData.name || !formData.description || !formData.location) {
      setError('Не все обязательные поля заполнены.')
      return
    }

    // Дополнительные проверки по типу объявления
    if (
      serverType === 'Недвижимость' &&
      (!formData.propertyType ||
        !formData.area ||
        !formData.rooms ||
        !formData.price)
    ) {
      setError('Не все обязательные поля для недвижимости заполнены.')
      return
    }

    if (
      serverType === 'Авто' &&
      (!formData.brand ||
        !formData.model ||
        !formData.year ||
        !formData.mileage)
    ) {
      setError('Не все обязательные поля для авто заполнены.')
      return
    }

    if (
      serverType === 'Услуги' &&
      (!formData.serviceType || !formData.experience || !formData.cost)
    ) {
      setError('Не все обязательные поля для услуг заполнены.')
      return
    }

    // Формируем данные для отправки на сервер
    const dataToSubmit = { ...formData, type: serverType }

    try {
      const response = await axios.post(
        'http://localhost:3000/items',
        dataToSubmit
      )
      // Сервер возвращает объект ListPageTypes с сгенерированным id
      addItem(response.data)
      localStorage.removeItem('draftFormData')
      navigate('/')
    } catch (error) {
      console.error('Ошибка:', error)
      if (error instanceof AxiosError) {
        if (error.response) {
          setError(
            `Ошибка загрузки: ${error.response.status} - ${error.response.statusText}`
          )
        } else if (error.request) {
          setError(
            'Не удалось получить ответ от сервера. Проверьте ваше подключение.'
          )
        } else {
          setError(`Ошибка: ${error.message}`)
        }
      } else {
        setError('Произошла неизвестная ошибка.')
      }
    }
  }

  return (
    <div>
      <h1>Форма для объявления</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input
            required
            type='text'
            name='name'
            onChange={handleInputChange}
            value={formData.name}
          />
        </label>
        <label>
          Описание:
          <textarea
            name='description'
            required
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Локация:
          <input
            required
            type='text'
            name='location'
            onChange={handleInputChange}
            value={formData.location}
          />
        </label>
        <select
          required
          name='type'
          value={formData.type}
          onChange={handleInputChange}
        >
          <option value=''>Выберите категорию</option>
          <option value='realty'>Недвижимость</option>
          <option value='auto'>Авто</option>
          <option value='services'>Услуги</option>
        </select>
        {formData.type === 'realty' && (
          <div>
            <label>
              Тип недвижимости:
              <input
                type='text'
                name='propertyType'
                value={formData.propertyType || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Площадь:
              <input
                type='number'
                name='area'
                value={formData.area || 0}
                onChange={handleNumberInputChange}
              />
            </label>
            <label>
              Комнаты:
              <input
                type='number'
                name='rooms'
                value={formData.rooms || 0}
                onChange={handleNumberInputChange}
              />
            </label>
            <label>
              Цена:
              <input
                type='number'
                name='price'
                value={formData.price || 0}
                onChange={handleNumberInputChange}
              />
            </label>
          </div>
        )}
        {formData.type === 'auto' && (
          <div>
            <label>
              Марка:
              <input
                type='text'
                name='brand'
                value={formData.brand || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Модель:
              <input
                type='text'
                name='model'
                value={formData.model || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Год:
              <input
                type='number'
                name='year'
                value={formData.year || 0}
                onChange={handleNumberInputChange}
              />
            </label>
            <label>
              Пробег:
              <input
                type='number'
                name='mileage'
                value={formData.mileage || 0}
                onChange={handleNumberInputChange}
              />
            </label>
          </div>
        )}
        {formData.type === 'services' && (
          <div>
            <label>
              Тип услуги:
              <input
                type='text'
                name='serviceType'
                value={formData.serviceType || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Опыт:
              <input
                type='text'
                name='experience'
                value={formData.experience || ''}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Стоимость:
              <input
                type='number'
                name='cost'
                value={formData.cost || 0}
                onChange={handleNumberInputChange}
              />
            </label>
          </div>
        )}
        <input
          type='file'
          className='custom-file-input'
          multiple
          accept='image/*, .pdf, .doc, .docx'
          onChange={handleFileChange}
        />
        <button type='submit'>Сохранить</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default FormPage
