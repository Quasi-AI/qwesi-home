import { createSlice } from '@reduxjs/toolkit'

// Helper functions for localStorage
const loadCartFromStorage = () => {
    if (typeof window !== 'undefined') {
        try {
            const savedCart = localStorage.getItem('qwesi-cart')
            return savedCart ? JSON.parse(savedCart) : { total: 0, cartItems: {} }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error)
            return { total: 0, cartItems: {} }
        }
    }
    return { total: 0, cartItems: {} }
}

const saveCartToStorage = (cart) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('qwesi-cart', JSON.stringify(cart))
        } catch (error) {
            console.error('Error saving cart to localStorage:', error)
        }
    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromStorage(),
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
            saveCartToStorage(state)
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
            saveCartToStorage(state)
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
            saveCartToStorage(state)
        },
        setCart: (state, action) => {
            const { cartItems, total } = action.payload;
            state.cartItems = cartItems;
            state.total = total;
            saveCartToStorage(state)
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
            saveCartToStorage(state)
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, setCart } = cartSlice.actions

export default cartSlice.reducer
