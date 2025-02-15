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

const FormPage: React.FC<FormPageProps> = ({ addItem, updateItem }) => {
   // Если в URL есть параметр id, значит мы редактируем существующее объявление
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    description: '',
    location: '',
    type: '',
    image: '',
  })
  const [error, setError] = useState<string | null>(null)

  // Если редактирование – подтягиваем данные объявления с сервера
  useEffect(() => {
    if (id) {
      axios
        .get<ListPageTypes>(`http://localhost:3000/items/${id}`)
        .then((response) => {
          const item = response.data
          // Преобразуем серверный тип в формат для формы:
          // 'Недвижимость' -> 'realty', 'Авто' -> 'auto', 'Услуги' -> 'services'
          let formType: '' | 'realty' | 'auto' | 'services' = ''
          switch (item.type) {
            case 'Недвижимость':
              formType = 'realty'
              break
            case 'Авто':
              formType = 'auto'
              break
            case 'Услуги':
              formType = 'services'
              break
            default:
              formType = ''
          }
          setFormData({
            name: item.name,
            description: item.description,
            location: item.location,
            type: formType,
            image: item.image || '',
            propertyType: item.propertyType,
            area: item.area,
            rooms: item.rooms,
            price: item.price,
            brand: item.brand,
            model: item.model,
            year: item.year,
            mileage: item.mileage,
            serviceType: item.serviceType,
            experience: item.experience,
            cost: item.cost,
          })
        })
        .catch((err) => {
          console.error(err)
          setError('Не удалось загрузить данные объявления для редактирования.')
        })
    } else {
      // Если создаём новое объявление, можно загрузить данные из localStorage (если есть)
      const savedData = localStorage.getItem('draftFormData')
      if (savedData) {
        setFormData(JSON.parse(savedData))
      }
    }
  }, [id])

  // Сохраняем данные в localStorage только для нового объявления
  useEffect(() => {
    if (!id) {
      localStorage.setItem('draftFormData', JSON.stringify(formData))
    }
  }, [formData, id])

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
        if (updateItem) {
          updateItem(response.data)
        }
        // Переходим на страницу просмотра объявления
        navigate(`/item/${id}`)
      } else {
        // Режим создания – создаём новое объявление
        const response = await axios.post(
          'http://localhost:3000/items',
          dataToSubmit
        )
        addItem(response.data)
        localStorage.removeItem('draftFormData')
        navigate('/')
      }
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
    <div className='container'>
      <h1>Форма для объявления {id ? '(Редактирование)' : ''}</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Название:</label>
          <input
            required
            type='text'
            name='name'
            onChange={handleInputChange}
            value={formData.name}
          />
        </div>
        <div className='form-group'>
          <label>Описание:</label>
          <textarea
            name='description'
            required
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
            onChange={handleInputChange}
            value={formData.location}
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

        <button type='submit'>Сохранить</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default FormPage
