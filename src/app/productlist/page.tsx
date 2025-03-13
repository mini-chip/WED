import React, { useEffect, useState } from 'react'
import './ProductList.css'
import { getProductList } from 'src/api/getProductAPI'
import { Link, useNavigate } from 'react-router-dom'

export default function ProductList() {
    const [productList, setProductList] = useState([])
    const [sortOrder, setSortOrder] = useState('reviewOrder')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = await getProductList()
                setProductList(productList)
            } catch (error) {
                console.error('상품 목록을 가져오는 중 에러 발생:', error)
            }
        }

        fetchProducts()
    }, [])

    const handleSelected = (e: any) => {
        setSortOrder(e.target.value)
    }

    const sortProducts = (products: any, order: any) => {
        if (order === 'reviewOrder') {
            return [...products].sort((a, b) => b.rating.rate - a.rating.rate)
        } else if (order === 'descendingOrder') {
            return [...products].sort((a, b) => b.price - a.price)
        }
        return products
    }

    return (
        <div>
            <h1>상품 목록</h1>
            <label htmlFor="sort">정렬 기준: </label>
            <select id="sort" className="outline-none" value={sortOrder} onChange={handleSelected}>
                <option value="reviewOrder">평점순</option>
                <option value="descendingOrder">높은 가격순</option>
            </select>
            <Link to="/cart" className="cart-link">
                장바구니로 이동
            </Link>
            <div className="product-list">
                {sortProducts(productList, sortOrder).map((product: any) => (
                    <li key={product.id} className="product-card">
                        <Link to={`/products/${product.id}`}>
                            <img src={product.image} alt={product.title} />
                            <div>
                                <h2>{product.title}</h2>
                                <p>{product.price}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </div>
        </div>
    )
}
