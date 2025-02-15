import React from 'react'
import { FeedbackFormData } from '../pages/FormPage'

interface FormFieldsProps {
  formData: FeedbackFormData
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
  handleNumberInputChange: React.ChangeEventHandler<HTMLInputElement>
  handleFileChange: React.ChangeEventHandler<HTMLInputElement>
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  handleInputChange,
  handleNumberInputChange,
  handleFileChange,
}) => (
  <>
    {/* Общие поля */}
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

    {/* Дополнительные поля для недвижимости */}
    {formData.type === 'realty' && (
      <>
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
      </>
    )}

    {/* Дополнительные поля для авто */}
    {formData.type === 'auto' && (
      <>
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
      </>
    )}

    {/* Дополнительные поля для услуг */}
    {formData.type === 'services' && (
      <>
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
      </>
    )}

    {/* Поле для загрузки файла */}
    <div className='form-group'>
      <label>Изображение:</label>
      <input
        type='file'
        className='custom-file-input'
        accept='image/*, .pdf, .doc, .docx'
        onChange={handleFileChange}
      />
    </div>
  </>
)
