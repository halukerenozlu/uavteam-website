// src/components/team/TeamSectionClient.tsx
"use client";

import TeamMemberCard from "./TeamMemberCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Forms = {
  mechanical: string;
  avionics: string;
  software: string;
};

type Member = {
  id: string;
  name: string;
  role?: string | null;
  squad?: "mechanical" | "avionics" | "software" | null;
  isCaptain: boolean;
  isPresident: boolean;
  imageUrl?: string | null;
  linkedinUrl?: string | null;
};

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

export default function TeamSectionClient({
  members,
  forms,
}: {
  members: Member[];
  forms: Forms;
}) {
  const president = members.find((m) => m.isPresident) ?? null;
  const captains = members.filter((m) => m.isCaptain && !m.isPresident);
  const squads = {
    mechanical: members.filter((m) => m.squad === "mechanical"),
    avionics: members.filter((m) => m.squad === "avionics"),
    software: members.filter((m) => m.squad === "software"),
  };

  return (
    <section id="team" className="bg-white text-black">
      <div className="h-[40px]" />
      <div className="w-full flex justify-center">
        <div className="mx-auto max-w-[1200px] px-8 py-16 flex flex-col items-center gap-16">
          {/* President */}
          {president && (
            <div className="flex flex-col items-center">
              <TeamMemberCard
                member={{
                  id: president.id,
                  name: president.name,
                  role: president.role ?? undefined,
                  imageUrl: president.imageUrl ?? undefined,
                  linkedinUrl: president.linkedinUrl ?? undefined,
                }}
                size="lg"
              />
            </div>
          )}

          <Connector />

          {/* Captains */}
          {captains.length > 0 && (
            <div className="flex flex-wrap justify-center gap-10 mx-auto md:max-w-[600px]">
              {captains.map((c) => (
                <TeamMemberCard
                  key={c.id}
                  member={{
                    id: c.id,
                    name: c.name,
                    role: c.role ?? undefined,
                    imageUrl: c.imageUrl ?? undefined,
                    linkedinUrl: c.linkedinUrl ?? undefined,
                  }}
                />
              ))}
            </div>
          )}

          <Connector2 />

          {/* Squads */}
          <div className="grid w-full gap-20 md:grid-cols-3">
            {/* Mechanical */}
            <div className="flex flex-col items-center text-center">
              <h4 className="text-xl font-semibold mb-4">Mechanical</h4>
              <div className="h-[30px]" />
              <div className="flex flex-wrap justify-center gap-6 w-full mx-auto md:max-w-[528px]">
                {squads.mechanical.map((m) => (
                  <TeamMemberCard
                    key={m.id}
                    member={{
                      id: m.id,
                      name: m.name,
                      role: m.role ?? undefined,
                      imageUrl: m.imageUrl ?? undefined,
                      linkedinUrl: m.linkedinUrl ?? undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Avionics */}
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4">Avionics</h4>
              <div className="h-[30px]" />
              <div className="flex flex-wrap justify-center gap-6 w-full mx-auto md:max-w-[528px]">
                {squads.avionics.map((m) => (
                  <TeamMemberCard
                    key={m.id}
                    member={{
                      id: m.id,
                      name: m.name,
                      role: m.role ?? undefined,
                      imageUrl: m.imageUrl ?? undefined,
                      linkedinUrl: m.linkedinUrl ?? undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Software */}
            <div className="flex flex-col items-center text-center">
              <h4 className="text-xl font-semibold mb-4">Software</h4>
              <div className="h-[30px]" />
              <div className="flex flex-wrap justify-center gap-6 w-full mx-auto md:max-w-[528px]">
                {squads.software.map((m) => (
                  <TeamMemberCard
                    key={m.id}
                    member={{
                      id: m.id,
                      name: m.name,
                      role: m.role ?? undefined,
                      imageUrl: m.imageUrl ?? undefined,
                      linkedinUrl: m.linkedinUrl ?? undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-[40px]" />

          {/* Join Us */}
          <div id="join" className="w-full !px-4 !sm:px-0">
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
                </p>
                <div className="h-[30px]" />
                <div className="grid gap-8 sm:grid-cols-3 ">
                  <JoinCard title="Mechanical" href={forms.mechanical} />
                  <JoinCard title="Avionics" href={forms.avionics} />
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
