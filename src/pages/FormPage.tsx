import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { ListPageTypes } from '../App'
import { FormFields } from '../components/FormFields'

export interface FeedbackFormData {
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

  const [formData, setFormData] = useState<FeedbackFormData>(() => {
    if (!id) {
      const saved = localStorage.getItem(DRAFT_KEY)
      return saved ? JSON.parse(saved) : defaultState
    }
    return defaultState
  })
  const [error, setError] = useState<string | null>(null)

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
    if (!id) localStorage.removeItem(DRAFT_KEY)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

    if (!formData.name || !formData.description || !formData.location) {
      setError('Не все обязательные поля заполнены.')
      return
    }
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

    const dataToSubmit = { ...formData, type: serverType }

    try {
      if (id) {
        const response = await axios.put(
          `http://localhost:3000/items/${id}`,
          dataToSubmit
        )
        if (updateItem) updateItem(response.data)
        navigate(`/item/${id}`)
      } else {
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
        <FormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleNumberInputChange={handleNumberInputChange}
          handleFileChange={handleFileChange}
        />
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
