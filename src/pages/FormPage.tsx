import React, { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
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
  updateItem?: (updatedItem: ListPageTypes) => void
}

const DRAFT_KEY = 'draftFormData'

const FormPage: React.FC<FormPageProps> = ({ addItem, updateItem }) => {
  // Если в URL есть параметр id, значит мы редактируем существующее объявление
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const defaultState: FeedbackFormData = {
    name: '',
    description: '',
    location: '',
    type: '',
    image: '',
    propertyType: '',
    area: 0,
    rooms: 0,
    price: 0,
    brand: '',
    model: '',
    year: 0,
    mileage: 0,
    serviceType: '',
    experience: '',
    cost: 0,
  }

  // Ленивая инициализация: если новое объявление и есть сохранённый черновик, используем его
  const [formData, setFormData] = useState<FeedbackFormData>(() => {
    if (!id) {
      const savedData = localStorage.getItem(DRAFT_KEY)
      return savedData ? JSON.parse(savedData) : defaultState
    }
    return defaultState
  })
  const [error, setError] = useState<string | null>(null)

  // Если редактирование – загружаем данные с сервера
  useEffect(() => {
    if (id) {
      axios
        .get<ListPageTypes>(`http://localhost:3000/items/${id}`)
        .then((response) => {
          const item = response.data
          const formType: '' | 'realty' | 'auto' | 'services' =
            item.type === 'Недвижимость'
              ? 'realty'
              : item.type === 'Авто'
              ? 'auto'
              : item.type === 'Услуги'
              ? 'services'
              : ''
          setFormData({
            name: item.name,
            description: item.description,
            location: item.location,
            type: formType,
            image: item.image || '',
            propertyType: item.propertyType || '',
            area: item.area || 0,
            rooms: item.rooms || 0,
            price: item.price || 0,
            brand: item.brand || '',
            model: item.model || '',
            year: item.year || 0,
            mileage: item.mileage || 0,
            serviceType: item.serviceType || '',
            experience: item.experience || '',
            cost: item.cost || 0,
          })
        })
        .catch((err) => {
          console.error(err)
          setError('Не удалось загрузить данные объявления для редактирования.')
        })
    }
  }, [id])

  // Сохраняем данные в localStorage только для нового объявления
  useEffect(() => {
    if (!id) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    }
  }, [formData, id])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : 0 }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0].name }))
    }
  }

  const clearForm = () => {
    setFormData(defaultState)
    if (!id) {
      localStorage.removeItem(DRAFT_KEY)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Преобразуем тип для сервера
    let serverType: 'Недвижимость' | 'Авто' | 'Услуги'
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
    // Дополнительные проверки для каждой категории
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

    // Формируем данные для отправки
    const dataToSubmit = { ...formData, type: serverType }

    try {
      if (id) {
        // Режим редактирования – обновляем объявление
        const response = await axios.put(
          `http://localhost:3000/items/${id}`,
          dataToSubmit
        )
        // Если функция updateItem передана, обновляем глобальное состояние
        if (updateItem) updateItem(response.data)
        // Переходим на страницу просмотра объявления
        navigate(`/item/${id}`)
      } else {
        // Режим создания – создаём новое объявление
        const response = await axios.post(
          'http://localhost:3000/items',
          dataToSubmit
        )
        addItem(response.data)
        localStorage.removeItem(DRAFT_KEY)
        navigate('/')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      if (axios.isAxiosError(error)) {
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
    <div className='container'>
      <h1>Форма для объявления {id ? '(Редактирование)' : ''}</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Название:</label>
          <input
            required
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group'>
          <label>Описание:</label>
          <textarea
            required
            name='description'
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group'>
          <label>Локация:</label>
          <input
            required
            type='text'
            name='location'
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        <div className='form-group'>
          <label>Категория:</label>
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
        </div>

        {formData.type === 'realty' && (
          <div>
            <div className='form-group'>
              <label>Тип недвижимости:</label>
              <input
                type='text'
                name='propertyType'
                value={formData.propertyType || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Площадь:</label>
              <input
                type='number'
                name='area'
                value={formData.area || 0}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Комнаты:</label>
              <input
                type='number'
                name='rooms'
                value={formData.rooms || 0}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Цена:</label>
              <input
                type='number'
                name='price'
                value={formData.price || 0}
                onChange={handleNumberInputChange}
              />
            </div>
          </div>
        )}

        {formData.type === 'auto' && (
          <div>
            <div className='form-group'>
              <label>Марка:</label>
              <input
                type='text'
                name='brand'
                value={formData.brand || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Модель:</label>
              <input
                type='text'
                name='model'
                value={formData.model || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Год:</label>
              <input
                type='number'
                name='year'
                value={formData.year || 0}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Пробег:</label>
              <input
                type='number'
                name='mileage'
                value={formData.mileage || 0}
                onChange={handleNumberInputChange}
              />
            </div>
          </div>
        )}

        {formData.type === 'services' && (
          <div>
            <div className='form-group'>
              <label>Тип услуги:</label>
              <input
                type='text'
                name='serviceType'
                value={formData.serviceType || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Опыт:</label>
              <input
                type='text'
                name='experience'
                value={formData.experience || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className='form-group'>
              <label>Стоимость:</label>
              <input
                type='number'
                name='cost'
                value={formData.cost || 0}
                onChange={handleNumberInputChange}
              />
            </div>
          </div>
        )}

        <div className='form-group'>
          <label>Изображение:</label>
          <input
            type='file'
            className='custom-file-input'
            multiple
            accept='image/*, .pdf, .doc, .docx'
            onChange={handleFileChange}
          />
        </div>

        <div className='form-buttons'>
          <button type='submit' className='button'>
            Сохранить
          </button>
          <button type='button' onClick={clearForm} className='button'>
            Очистить данные
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default FormPage
