import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { ListPageTypes } from '../App'

function ItemPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<ListPageTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true)
      try {
        const response = await axios.get<ListPageTypes>(
          `http://localhost:3000/items/${id}`
        )
        setItem(response.data)
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          setError(
            `Ошибка загрузки: ${err.response.status} ${err.response.statusText}`
          )
        } else {
          setError('Произошла неизвестная ошибка.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading)
    return (
      <div className='container'>
        <p>Загрузка...</p>
      </div>
    )
  if (error)
    return (
      <div className='container'>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  if (!item)
    return (
      <div className='container'>
        <p>Объявление не найдено.</p>
      </div>
    )

  return (
    <div className='container'>
      <h1>{item.name}</h1>
      <img
        src={
          item.image
            ? item.image
            : 'https://azaliadecor.ru/upload/iblock/5c7/pya5k5qetqhcd2lm4finiaulj4hjv7pq.jpg'
        }
        alt={item.name}
        style={{
          width: '300px',
          height: '300px',
          objectFit: 'cover',
          marginBottom: '15px',
        }}
      />
      <p>
        <strong>ID:</strong> {item.id}
      </p>
      <p>
        <strong>Описание:</strong> {item.description}
      </p>
      <p>
        <strong>Локация:</strong> {item.location}
      </p>
      <p>
        <strong>Категория:</strong> {item.type}
      </p>

      {item.type === 'Недвижимость' && (
        <>
          <p>
            <strong>Тип недвижимости:</strong> {item.propertyType}
          </p>
          <p>
            <strong>Площадь:</strong> {item.area} кв.м
          </p>
          <p>
            <strong>Комнаты:</strong> {item.rooms}
          </p>
          <p>
            <strong>Цена:</strong> {item.price} руб.
          </p>
        </>
      )}

      {item.type === 'Авто' && (
        <>
          <p>
            <strong>Марка:</strong> {item.brand}
          </p>
          <p>
            <strong>Модель:</strong> {item.model}
          </p>
          <p>
            <strong>Год:</strong> {item.year}
          </p>
          <p>
            <strong>Пробег:</strong> {item.mileage} км
          </p>
        </>
      )}

      {item.type === 'Услуги' && (
        <>
          <p>
            <strong>Тип услуги:</strong> {item.serviceType}
          </p>
          <p>
            <strong>Опыт:</strong> {item.experience}
          </p>
          <p>
            <strong>Стоимость:</strong> {item.cost} руб.
          </p>
        </>
      )}
      <div></div>

      <Link
        to='/form'
        className='button'
        style={{ marginTop: '20px', display: 'inline-block' }}
      >
        Редактировать
      </Link>

      <div>
        <Link
          to='/'
          className='button'
          style={{ marginTop: '20px', display: 'inline-block' }}
        >
          Вернуться к списку объявлений
        </Link>
      </div>
    </div>
  )
}

export default ItemPage
