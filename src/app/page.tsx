import Navbar from "@/app/component/navbar/page";
import "./globals.css";
import ProductList from "./productlist/page";

export default function Home() {
  return (
    <div>
      <Navbar />
      <ProductList />
    </div>
  );
}
