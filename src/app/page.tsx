import Navbar from "@/app/component/navbar/page";
import "./globals.css";
export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="w-20 h-20 bg-black">test</div>
      <h1 className="font-semibold">Welcome to WED</h1>
    </div>
  );
}
