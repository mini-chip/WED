import React, { createContext, useState, ReactNode } from 'react'

// Cart 아이템의 타입 정의
interface Product {
    id: number
    title: string
    price: number
    image: string
}

interface CartItem {
    product: Product
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (product: Product, quantity: number) => void
}

export const CartContext = createContext<CartContextType | null>(null)

interface CartProviderProps {
    children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([])

    const addToCart = (product: Product, quantity: number) => {
        setCart((prevCart) => {
            const existingProductIndex = prevCart.findIndex((item) => item.product.id === product.id)
            if (existingProductIndex !== -1) {
                const updatedCart = [...prevCart]
                updatedCart[existingProductIndex].quantity += quantity
                return updatedCart
            } else {
                return [...prevCart, { product, quantity }]
            }
        })
    }

    return <CartContext.Provider value={{ cart, addToCart }}>{children}</CartContext.Provider>
}
