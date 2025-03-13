import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

export default function CartPage() {
    const { cart }: any = useContext(CartContext)

    const totalAmount = cart.reduce((sum: any, item: any) => sum + item.product.price * item.quantity, 0)

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">장바구니</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-500">장바구니에 담긴 상품이 없습니다.</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item: any) => (
                        <div key={item.product.id} className="flex items-center p-4 bg-white shadow-md rounded-lg">
                            <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-20 h-20 object-cover rounded-lg mr-4"
                            />
                            <div className="flex-1">
                                <h2 className="text-lg font-medium">{item.product.title}</h2>
                                <p className="text-gray-500">수량: {item.quantity}</p>
                                <p className="text-gray-800 font-semibold">
                                    가격: ${(item.product.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {cart.length > 0 && (
                <h2 className="text-xl font-bold text-right mt-6">총 금액: ${totalAmount.toFixed(2)}</h2>
            )}
        </div>
    )
}
