import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks'
import {
  fetchItem,
  deleteItemThunk,
  clearItem,
} from '../redux/slices/currentItemSlice'

const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { item, loading, error } = useAppSelector((state) => state.currentItem)

  useEffect(() => {
    if (id) {
      dispatch(fetchItem(id))
    }
    // Очистим состояние при размонтировании компонента
    return () => {
      dispatch(clearItem())
    }
  }, [dispatch, id])

  const handleDelete = async () => {
    if (
      window.confirm('Вы действительно хотите удалить это объявление?') &&
      id
    ) {
      dispatch(deleteItemThunk(id))
        .unwrap()
        .then(() => {
          // Можно также обновить список объявлений, если потребуется
          navigate('/')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

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
      <div className='item-page'>
        <div className='item-photo'>
          <img
            src={
              item.image
                ? item.image
                : 'https://azaliadecor.ru/upload/iblock/5c7/pya5k5qetqhcd2lm4finiaulj4hjv7pq.jpg'
            }
            alt={item.name}
          />
        </div>
        <div className='item-details'>
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

          <div className='item-buttons'>
            <Link to={`/form/${item.id}`} className='button'>
              Редактировать
            </Link>
            <button onClick={handleDelete} className='button item-buttons-del'>
              Удалить
            </button>
          </div>
          <div className='item-buttons'>
            <Link to='/' className='button'>
              Вернуться к списку объявлений
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemPage
