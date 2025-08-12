// src/components/team/teamData.ts
import type { TeamMember } from "./TeamMemberCard";

export type TeamData = {
  president: TeamMember;
  captains: TeamMember[]; // tam 2 kişi (şimdilik)
  squads: {
    mechanical: TeamMember[];
    avionic: TeamMember[];
    software: TeamMember[];
  };
  forms: {
    mechanical: string;
    avionic: string;
    software: string;
  };
};

export const teamData: TeamData = {
  president: {
    id: "president",
    name: "Yasin Turanlı",
    role: "Club President",
    imageUrl: null,
    linkedinUrl: "https://www.linkedin.com/",
  },
  captains: [
    {
      id: "captain-1",
      name: "Berkay Düşmezkalender",
      role: "Team Captain",
      imageUrl: null,
      linkedinUrl: "https://www.linkedin.com/",
    },
    {
      id: "captain-2",
      name: "Erhan Şallı",
      role: "Team Captain",
      imageUrl: null,
      linkedinUrl: "https://www.linkedin.com/",
    },
    {
      id: "captain-3",
      name: "Efe Eroğlu",
      role: "Team Captain",
      imageUrl: null,
      linkedinUrl: "https://www.linkedin.com/",
    },
  ],
  squads: {
    mechanical: [
      {
        id: "mech-1",
        name: "Arda",
        role: "Mechanical",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "mech-2",
        name: "Fatih",
        role: "Mechanical",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "mech-3",
        name: "Melike",
        role: "Mechanical",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      // 4. kişi eklersen otomatik alt satıra geçer
    ],
    avionic: [
      {
        id: "av-1",
        name: "Sefa",
        role: "Avionic",
        imageUrl: "/drone.jpg",
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "av-2",
        name: "Tarık",
        role: "Avionic",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "av-3",
        name: "Şahin",
        role: "Avionic",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
    ],
    software: [
      {
        id: "sw-1",
        name: "Emirhan",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "sw-2",
        name: "Efe",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "sw-3",
        name: "Çağrı",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "sw-4",
        name: "Meriç",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "sw-5",
        name: "Muhammet",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "sw-6",
        name: "Dilara",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
      {
        id: "sw-7",
        name: "Haluk",
        role: "Software",
        imageUrl: null,
        linkedinUrl: "https://www.linkedin.com/",
      },
    ],
  },
  forms: {
    mechanical: "https://forms.gle/xxx-mech",
    avionic: "https://forms.gle/xxx-av",
    software: "https://forms.gle/xxx-sw",
  },
};
