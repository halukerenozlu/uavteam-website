// src/config/nav.ts
export type NavItem = { label: string; href: string; external?: boolean };

export const headerLeftLinks: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Join Us", href: "/join-us" },
];

export const adminLink: NavItem = { label: "Admin", href: "/admin" };

export const headerRightLinks: NavItem[] = [
  { label: "Contact", href: "/contact" },
  {
    label: "Instagram",
    href: "https://instagram.com/kuasaruav",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/kuasaruav",
    external: true,
  },
  { label: "YouTube", href: "https://youtube.com/@kuasaruav", external: true },
];

export const footerLeftLinks: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Join Us", href: "/join-us" },
];

export const footerRightLinks: NavItem[] = [
  { label: "Contact", href: "/contact" },
  {
    label: "Instagram",
    href: "https://instagram.com/kuasaruav",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/kuasaruav",
    external: true,
  },
  { label: "YouTube", href: "https://youtube.com/@kuasaruav", external: true },
];
