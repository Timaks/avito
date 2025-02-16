import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FormPage from './pages/FormPage'
import ListPage from './pages/ListPage'
import ItemPage from './pages/ItemPage'
import NotFound from './pages/NotFound'
import './index.css'

// Интерфейс для типизации данных объявления.
//  вынести в отдельный файл (types.ts).
export interface ListPageTypes {
  id: number
  name: string
  description: string
  location: string
  type: 'Недвижимость' | 'Авто' | 'Услуги'
  image?: string
  // поля для недвижимости
  propertyType?: string
  area?: number
  rooms?: number
  price?: number
  // поля для авто
  brand?: string
  model?: string
  year?: number
  mileage?: number
  // поля для услуг
  serviceType?: string
  experience?: string
  cost?: number
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ListPage />} />
        <Route path='/form/:id' element={<FormPage />} />
        <Route path='/form' element={<FormPage />} />
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
