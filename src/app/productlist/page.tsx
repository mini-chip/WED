"use client";
import { useEffect, useState } from "react";
import { getProductList } from "@/api/getProductAPI";
import { Link, useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [sortOrder, setSortOrder] = useState("reviewOrder");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getProductList();
        setProductList(productList);
      } catch (error) {
        console.error("상품 목록을 가져오는 중 에러 발생:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const sortProducts = (products: any[], order: string) => {
    if (order === "reviewOrder") {
      return [...products].sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (order === "descendingOrder") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    return products;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">상품 목록</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2">
            정렬 기준:
          </label>
          <select
            id="sort"
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={sortOrder}
            onChange={handleSelected}
          >
            <option value="reviewOrder">평점순</option>
            <option value="descendingOrder">높은 가격순</option>
          </select>
        </div>
        <Link to="/cart" className="text-blue-500 hover:underline">
          장바구니로 이동
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortProducts(productList, sortOrder).map((product: any) => (
          <div key={product.id} className="border rounded-lg shadow-md p-4">
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600">{product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
