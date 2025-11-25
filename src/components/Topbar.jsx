import { Menu, Bell } from "lucide-react";
import TextType from "@/components/TextType";

function Topbar({ toggleSidebar }) {
const texts = [
  "Selamat datang di Sistem Manajemen Bakso Aci Gang Leak",
  "Kelola stock dan restock dengan mudah",
  "Lihat penjualan harian dan analisis produk favorit",

];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button */}
        <button onClick={toggleSidebar} className="lg:hidden">
          <Menu size={24} />
        </button>

        {/* Title with TextType Animation */}
        <div className="flex-1 mx-auto">
          <TextType
            text={texts}
            as="h1"
            className="text-xl font-semibold text-red-500 uppercase"
            typingSpeed={50}
            deletingSpeed={30}
            pauseDuration={2000}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
            cursorClassName="text-red-500"
            cursorBlinkDuration={0.5}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            <img 
              src="https://res.cloudinary.com/dzfqsajp3/image/upload/v1764065627/basoaci_oxltji.png" 
              alt="Bakso Aci Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;