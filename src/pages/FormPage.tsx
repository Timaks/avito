import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks'
import { FormFields } from '../components/FormFields'
import {
  fetchItem as fetchItemThunk,
  clearItem,
} from '../redux/slices/currentItemSlice'
import { createItem, updateItemThunk } from '../redux/slices/itemsSlice'

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

const DRAFT_KEY = 'draftFormData'

const FormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Если редактируем, получаем объявление из Redux
  const currentItem = useAppSelector((state) => state.currentItem.item)

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

  // При редактировании – получаем данные объявления через Redux
  useEffect(() => {
    if (id) {
      dispatch(fetchItemThunk(id))
    }
    return () => {
      dispatch(clearItem())
    }
  }, [id, dispatch])

  // Когда данные из Redux загрузятся, заполняем форму
  useEffect(() => {
    if (id && currentItem) {
      const formType: '' | 'realty' | 'auto' | 'services' =
        currentItem.type === 'Недвижимость'
          ? 'realty'
          : currentItem.type === 'Авто'
          ? 'auto'
          : currentItem.type === 'Услуги'
          ? 'services'
          : ''
      setFormData({
        name: currentItem.name,
        description: currentItem.description,
        location: currentItem.location,
        type: formType,
        image: currentItem.image || '',
        propertyType: currentItem.propertyType || '',
        area: currentItem.area || 0,
        rooms: currentItem.rooms || 0,
        price: currentItem.price || 0,
        brand: currentItem.brand || '',
        model: currentItem.model || '',
        year: currentItem.year || 0,
        mileage: currentItem.mileage || 0,
        serviceType: currentItem.serviceType || '',
        experience: currentItem.experience || '',
        cost: currentItem.cost || 0,
      })
    }
  }, [id, currentItem])

  // Сохраняем черновик в localStorage, если создаём новое объявление
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
        // Обновляем существующее объявление
        const resultAction = await dispatch(
          updateItemThunk({ id: Number(id), ...dataToSubmit })
        )
        if (updateItemThunk.fulfilled.match(resultAction)) {
          navigate(`/item/${id}`)
        } else {
          setError('Ошибка при обновлении объявления.')
        }
      } else {
        // Создаём новое объявление
        const resultAction = await dispatch(createItem(dataToSubmit))
        if (createItem.fulfilled.match(resultAction)) {
          localStorage.removeItem(DRAFT_KEY)
          navigate('/')
        } else {
          setError('Ошибка при создании объявления.')
        }
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Произошла неизвестная ошибка.')
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
