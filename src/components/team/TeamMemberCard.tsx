// src/components/team/TeamMemberCard.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

export type TeamMember = {
  id: string;
  name: string;
  role?: string; // DB’den null gelebilirse üst seviyede undefined’a çevireceğiz
  imageUrl?: string | null;
  linkedinUrl?: string | null;
};

type Props = {
  member: TeamMember;
  size?: "lg" | "md";
  align?: "center" | "left";
};

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  const f = p[0]?.[0] ?? "";
  const l = p.length > 1 ? p[p.length - 1][0] : "";
  return (f + l).toUpperCase();
}

/**
 * İsim satırlarını hazırlar:
 * - En fazla 3 kelime
 * - Kelime başına max 13 karakter (uzunsa kısalt)
 * - İlk kelime 1. satır, kalan(lar) altta
 */
function formatNameLines(fullName: string): string[] {
  const words = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => (w.length > 13 ? w.slice(0, 14) : w));

  if (words.length <= 1) return words;
  return [words[0], ...words.slice(1)];
}

export default function TeamMemberCard({
  member,
  size = "md",
  align = "center",
}: Props) {
  const dim = size === "lg" ? "h-32 w-32 text-2xl" : "h-24 w-24 text-xl";
  const textAlign =
    align === "left" ? "items-start text-left" : "items-center text-center";

  const nameLines = formatNameLines(member.name);

  return (
    <div className={`flex flex-col ${textAlign} gap-3`}>
      <Avatar className={`${dim} border border-black/10 shadow-sm`}>
        <AvatarImage src={member.imageUrl ?? undefined} alt={member.name} />
        <AvatarFallback>{initials(member.name)}</AvatarFallback>
      </Avatar>

      {/* Rol → İsim (çok satır) → LinkedIn ikonu */}
      <div className="flex flex-col items-center gap-1">
        {member.role && (
          <div className="text-sm text-gray-600">{member.role}</div>
        )}

        {/* İSİM / SOYİSİM ÇOK SATIRLI */}
        <div className="text-base font-semibold leading-snug">
          {nameLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </div>

        {member.linkedinUrl && (
          <Link
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} LinkedIn`}
            className="mt-1 inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 transition"
            title="LinkedIn profiline git"
          >
            <FaLinkedin className="text-[#0A66C2]" size={20} />
          </Link>
        )}
      </div>
    </div>
  );
}
