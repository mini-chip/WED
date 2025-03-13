import axios from 'axios'

export const getProductList = async () => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products')
        console.log(response)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('상품 목록을 가져오는 중 에러 발생:', error)
        throw error
    }
}

export const getDetailProduct = async (productId: any) => {
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`)
        console.log(response)
        return response.data
    } catch (error) {
        console.error('상세 상품 정보를 가져오는 중 에러 발생:', error)
        throw error
    }
}
