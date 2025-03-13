import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import './ProductDetail.css'
import { getDetailProduct } from './../api/getProductAPI'
import { CartContext } from './../context/CartContext'

const ProductDetail = () => {
    const { productId } = useParams()
    const [detailProduct, setDetailProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useContext(CartContext)

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const product = await getDetailProduct(productId)
                setDetailProduct(product)
            } catch (error) {
                console.error('상세 상품 정보를 가져오는 중 에러 발생:', error)
            }
        }

        fetchProductDetail()
    }, [productId])

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1)
    }

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1))
    }

    const handleAddToCart = () => {
        addToCart(detailProduct, quantity)
        alert('장바구니에 담겼습니다!')
    }

    if (!detailProduct) {
        return <div>Loading...</div>
    }

    const totalPrice = detailProduct.price * quantity

    return (
        <div className="product-detail-container">
            <h1>{detailProduct.title}</h1>
            <img src={detailProduct.image} alt={detailProduct.title} />
            <p>{detailProduct.description}</p>
            <p className="price">Price: ${detailProduct.price}</p>
            <div className="quantity-control">
                <button onClick={decreaseQuantity}>-</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
            </div>
            <p className="total-price">Total Price: ${totalPrice.toFixed(2)}</p>
            <button className="add-to-cart" onClick={handleAddToCart}>
                장바구니에 담기
            </button>
        </div>
    )
}

export default ProductDetail
