// src/components/footer/Footer.tsx
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { getSocialLinks } from "@/app/admin/(panel)/control-center/actions";

export default async function Footer() {
  const res = await getSocialLinks();
  const map = res.ok
    ? Object.fromEntries(res.data.map((x) => [x.label, x.url]))
    : {};

  const instagram = map["Instagram"] || "https://instagram.com/kuasarinsis";
  const linkedin = map["LinkedIn"] || "https://linkedin.com/yourclub";
  const youtube = map["YouTube"] || "https://youtube.com/watch?v=OCv-QB3KOWw";

  return (
    <footer className="relative w-full bg-black h-[7vh] text-white py-2 px-2 mx-4">
      {/* Sol menü */}
      <nav className="absolute left-4 top-0 h-full hidden min-[821px]:flex items-center gap-6 px-6 text-white">
        <Link href="/about" className="hover:text-gray-300 transition-colors">
          About
        </Link>
        <Link href="/team" className="hover:text-gray-300 transition-colors">
          Team
        </Link>
        <Link
          href="/vehicles"
          className="hover:text-gray-300 transition-colors"
        >
          Vehicles
        </Link>
        <Link
          href="/team#join"
          className="hover:text-gray-300 transition-colors"
        >
          Join Us
        </Link>
      </nav>

      {/* Orta yazı */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="font-bold">© 2025 Kuasar UAV Team</span>
      </div>

      {/* Sağ menü */}
      <nav className="absolute right-4 top-0 h-full hidden min-[821px]:flex items-center gap-4 px-6 text-white">
        <Link href="/contact" className="hover:text-gray-300 transition-colors">
          Contact
        </Link>
        <Link
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <FaInstagram size={16} />
        </Link>
        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <FaLinkedin size={16} />
        </Link>
        <Link
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <FaYoutube size={16} />
        </Link>
      </nav>
    </footer>
  );
}
