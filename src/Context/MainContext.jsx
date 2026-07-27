import React from 'react'
import { store } from '../Redux Toolkit/Store/Store'
import { Provider } from 'react-redux'

export default function ({children}) {
  return (
    <Provider store={store}>

      {children}
    </Provider>
  )
}
