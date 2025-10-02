import { configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
    return configureStore({
        reducer: {
            // Removed cart, product, address, rating reducers as part of shop/store removal
        },
    })
}
