import Link from "next/link";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-full  bg-black h-[7vh] text-white py-2 px-2 mx-4">
      {/* Sol menü */}

      <nav className="absolute left-4 top-0 h-full flex items-center gap-6 px-6 text-white">
        <Link
          href="#about"
          className="text-white hover:text-gray-300 transition-colors"
        >
          About
        </Link>
        <Link
          href="#team"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Team
        </Link>
        <Link
          href="#vehicles"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Vehicles
        </Link>
        <Link
          href="#join"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Join Us
        </Link>
      </nav>

      {/* Merkez başlık */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="font-bold text-white">© 2025 Kuasar UAV Team</span>
      </div>

      {/* Sağ menü */}
      <nav className="absolute right-4 top-0 h-full flex items-center gap-4 px-6 text-white">
        <Link
          href="/contact"
          className="text-white hover:text-gray-300 transition-colors"
        >
          Contact
        </Link>
        <Link
          href="https://instagram.com/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaInstagram size={16} />
        </Link>
        <Link
          href="https://linkedin.com/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaLinkedin size={16} />
        </Link>
        <Link
          href="https://youtube.com/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <FaYoutube size={16} />
        </Link>
      </nav>
    </footer>
  );
}
