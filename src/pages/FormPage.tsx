import React, { useState } from 'react'

interface FeedbackFormData {
  name: string
  description: string
  location: string
  type: string
  image: string
}
function FormPage() {
  // разместить логику формы создания/редактирования объявления
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    description: '',
    location: '',
    type: '',
    image: '',
  })

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
  const handleFileChange = () => {}
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Здесь можно выполнить валидацию и отправку данных, например, через axios
    console.log(formData)
  }
  return (
    <div>
      <h1>Форма для объявления</h1>
      {/*
Локация (обязательное)
Фото (необязательное)
Категория объявления (выпадающий список: Недвижимость, Авто, Услуги) (обязательное) */}
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
        <select name='type' value={formData.type} onChange={handleInputChange}>
          <option value=''>Выберите категорию</option>
          <option value='realty'>Недвижимость</option>
          <option value='auto'>Авто</option>
          <option value='services'>Услуги</option>
        </select>
        <input
          type='file'
          className='custom-file-input'
          multiple
          accept='image/*, .pdf, .doc, .docx'
          onChange={handleFileChange}
        />
        <button type='submit'>Сохранить</button>
      </form>
    </div>
  )
}

export default FormPage
