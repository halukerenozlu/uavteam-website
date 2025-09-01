// src/components/team/TeamSectionServer.tsx
import TeamSectionClient from "./TeamSectionClient";
import { getMembers } from "@/app/admin/(panel)/team/actions";
import { getApplyLinks } from "@/app/admin/(panel)/control-center/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamSectionServer() {
  const members = await getMembers();
  const links = await getApplyLinks();

  const forms = {
    mechanical: links?.mechanical || "https://forms.gle/xxx-mech",
    avionics: links?.avionic || "https://forms.gle/xxx-av", // 👈 map
    software: links?.software || "https://forms.gle/xxx-sw",
  };

  return <TeamSectionClient members={members} forms={forms} />;
}
