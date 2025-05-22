"use client";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { getDetailProduct } from "@/api/getProductAPI";
import { CartContext } from "@/context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const [detailProduct, setDetailProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const product = await getDetailProduct(productId);
        setDetailProduct(product);
      } catch (error) {
        console.error("상세 상품 정보를 가져오는 중 에러 발생:", error);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart(detailProduct, quantity);
    alert("장바구니에 담겼습니다!");
  };

  if (!detailProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const totalPrice = detailProduct.price * quantity;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{detailProduct.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={detailProduct.image}
          alt={detailProduct.title}
          className="w-full md:w-1/2 h-auto object-cover rounded-lg"
        />
        <div className="flex-1">
          <p className="text-gray-700 mb-4">{detailProduct.description}</p>
          <p className="text-xl font-bold mb-4">
            Price: ${detailProduct.price}
          </p>
          <div className="flex items-center mb-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-300 text-gray-700 p-2 rounded-l hover:bg-gray-400"
            >
              -
            </button>
            <span className="px-4 text-lg">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-300 text-gray-700 p-2 rounded-r hover:bg-gray-400"
            >
              +
            </button>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            Total Price: ${totalPrice.toFixed(2)}
          </p>
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleAddToCart}
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}
