import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import AddCategory from './Common Components/AddCategory.jsx'
import ViewCategory from './Common Components/ViewCategory.jsx'
import MainContext from './Context/MainContext.jsx'
import Login from './Pages/Login.jsx'
import AddSubCategory from './Common Components/AddSubCategory.jsx'
import ViewSubCategory from './Common Components/ViewSubCategory.jsx'
import AddProductCategory from './Common Components/AddProductCategory.jsx'
import ViewProductCategory from './Common Components/ViewProductCategory.jsx'
import AddProduct from './Common Components/AddProduct.jsx'
import ViewProduct from './Common Components/ViewProduct.jsx'
import ViewUser from './Common Components/ViewUser.jsx'
import ViewOrders from './Common Components/ViewOrders.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainContext>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />

            <Route path='/add-category' element={<AddCategory />} />
            <Route path='/edit-category/:id' element={<AddCategory />} />
            <Route path='/view-category' element={<ViewCategory />} />

            <Route path='/add-subcategory' element={<AddSubCategory />} />
            <Route path='/edit-subcategory/:id' element={<AddSubCategory />} />
            <Route path='/view-subcategory' element={<ViewSubCategory />} />

            <Route path='/add-productcategory' element={<AddProductCategory />} />
            <Route path='/edit-productcategory/:id' element={<AddProductCategory />} />
            <Route path='/view-productcategory' element={<ViewProductCategory />} />

             <Route path='/addproduct' element={<AddProduct />} />
            <Route path='/editproduct/:id' element={<AddProduct />} />
            <Route path='/viewproduct' element={<ViewProduct />} />
            <Route path='/users' element={<ViewUser />} />
            <Route path='/orders' element={<ViewOrders />} />
          </Route>
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </MainContext>

  </StrictMode>,
)
