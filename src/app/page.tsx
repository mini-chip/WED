import Navbar from "@/app/component/navbar/page";
import "./globals.css";
import OutfitMapperPage from "./utils/outfitMapper/page";

export default function Home() {
  return (
    <div>
      <Navbar />
      <OutfitMapperPage />
    </div>
  );
}
