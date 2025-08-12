// src/components/team/TeamSection.tsx
"use client";

import TeamMemberCard from "./TeamMemberCard";
import { teamData } from "./teamData";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Connector() {
  return (
    <div className="flex flex-col items-center">
      <div className="h-8 w-px bg-gray-300" />
      <div className="h-px w-40 bg-gray-300 md:w-80" />
    </div>
  );
}
function Connector2() {
  return (
    <div className="flex flex-col items-center">
      <div className="h-8 w-px bg-gray-300" />
      <div className="h-px w-40 bg-gray-300 md:w-300" />
    </div>
  );
}

export default function TeamSection() {
  const { president, captains, squads, forms } = teamData;

  return (
    <section id="team" className="bg-white text-black">
      <div className="h-[40px]" />
      <div className="w-full flex justify-center">
        {/* Ortalamak için container */}
        <div className="mx-auto max-w-[1200px] px-8 py-16 flex flex-col items-center gap-16">
          {/* 1) Başkan — ortada */}
          <div className="flex flex-col items-center">
            <TeamMemberCard member={president} size="lg" />
          </div>

          {/* Başkan → Kaptanlar bağlayıcı */}
          <Connector />

          {/* 2) Kaptanlar — 2 sütun, ortalanmış */}
          <div className="grid place-items-center gap-10 md:grid-cols-2">
            {captains.map((c) => (
              <TeamMemberCard key={c.id} member={c} />
            ))}
          </div>

          {/* Kaptanlar → Skuadlar bağlayıcı */}
          <Connector2 />

          {/* 3) Skuadlar — üç sütun: Mechanical / Avionics / Software */}
          <div className="grid w-full gap-20 md:grid-cols-3">
            {/* Mechanical */}
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4">Mechanical</h4>
              <div className="h-[30px]" />
              {/* Her satırda max 3 üye, fazlası alt satıra iner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 place-items-center">
                {squads.mechanical.map((m) => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>

            {/* Avionic */}
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4">Avionic</h4>
              <div className="h-[30px]" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 place-items-center">
                {squads.avionic.map((m) => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>

            {/* Software */}
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4">Software</h4>
              <div className="h-[30px]" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 place-items-center">
                {squads.software.map((m) => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          </div>
          <div className="h-[40px]" />
          {/* 4) Join Us — en altta, ortada */}
          <div id="join" className="w-full">
            <div className="w-full flex justify-center">
              <div className="mx-auto max-w-3xl text-center space-y-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold">Join Us</h3>
                  <div className="h-[10px]" />
                  <div className="h-1 w-24 bg-red-500 mt-2" />
                </div>
                <div className="h-[20px]" />
                <p className="text-gray-700">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reiciendis deleniti dolorum unde.
                </p>
                <div className="h-[30px]" />
                <div className="grid gap-8 sm:grid-cols-3 ">
                  <JoinCard title="Mechanical" href={forms.mechanical} />
                  <JoinCard title="Avionic" href={forms.avionic} />
                  <JoinCard title="Software" href={forms.software} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[60px]" />
    </section>
  );
}

function JoinCard({ title, href }: { title: string; href: string }) {
  return (
    <div className="rounded-xl border shadow-sm p-6 flex flex-col items-center justify-between !px-6 !py-3">
      <div className="text-lg font-semibold">{title}</div>
      <div className="h-[15px]" />
      <Button
        asChild
        className="mt-4 bg-black !text-white hover:bg-gray-800 !px-5"
      >
        <Link href={href} target="_blank" rel="noopener noreferrer">
          Apply via Google Form
        </Link>
      </Button>
    </div>
  );
}
