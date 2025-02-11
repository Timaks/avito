import { BrowserRouter, Routes, Route } from 'react-router-dom'

import FormPage from './pages/FormPage'
import ListPage from './pages/ListPage'
import ItemPage from './pages/ItemPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /form */}
        <Route path="/form" element={<FormPage />} />

        {/* /list */}
        <Route path="/" element={<ListPage />} />

        {/* /item/:id */}
        <Route path="/item/:id" element={<ItemPage />} />

        {/* 404 - на случай, если путь не найден */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
