"use client";
import { useEffect, useState } from "react";
import { getProductList } from "@/api/getProductAPI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OutfitMapperPage from "@/app/utils/outfitMapper/page";
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
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortProducts(productList, sortOrder).map((product: any) => (
          <div key={product.id} className="border rounded-lg shadow-md p-4">
            <Link href={`/products/${product.id}`}>
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
      </div> */}
      <OutfitMapperPage />
    </div>
  );
}
