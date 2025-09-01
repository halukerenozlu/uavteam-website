// src/app/admin/_components/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/control-center", label: "Control Center" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/team", label: "Team Members" },
  { href: "/admin/news", label: "News" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full px-4 py-6 !p-6 !pt-8">
      <nav className="space-y-3 ">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block rounded-lg px-3 py-2 text-lg font-medium relative !pb-2 ${
              pathname === l.href ? "text-black" : "text-gray-600"
            }`}
          >
            {l.label}
            {pathname === l.href && (
              <span
                className="absolute left-0 bottom-0 h-1 bg-red-500 transition-all duration-300 ease-in-out"
                style={{ width: "calc(100% - 3.5rem)" }}
              />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
