// src/app/admin/_components/team/TeamMembersList.tsx
"use client";

import { useState, useTransition } from "react";
import { deleteMember } from "@/app/admin/(panel)/team/actions";
import TeamMemberForm from "./TeamMemberForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// shadcn alert-dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Member = {
  id: string;
  name: string;
  role?: string | null;
  squad?: "mechanical" | "avionics" | "software" | null;
  isCaptain: boolean;
  isPresident: boolean;
  imageUrl?: string | null;
  linkedinUrl?: string | null;
  order: number;
};

function toFormInitial(m: Member) {
  return {
    id: m.id,
    name: m.name,
    role: m.role ?? "",
    squad: m.squad ?? null,
    isCaptain: m.isCaptain,
    isPresident: m.isPresident,
    imageUrl: m.imageUrl ?? "",
    linkedinUrl: m.linkedinUrl ?? "",
    order: m.order ?? 0,
  };
}

export default function TeamMembersList({ items }: { items: Member[] }) {
  // Yeni üye formu (üstte aç/kapa)
  const [creating, setCreating] = useState(false);

  // Hangi satır düzenleniyor?
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Member | null>(null);

  // Silme onayı
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState<Member | null>(null);

  const [isPending, startTransition] = useTransition();
  const hasItems = items && items.length > 0;

  const askDelete = (m: Member) => {
    setTarget(m);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!target) return;
    startTransition(async () => {
      await deleteMember(target.id);
      setDialogOpen(false);
      setTarget(null);
    });
  };

  const startEdit = (m: Member) => {
    // Aynı satıra ikinci kez basılırsa kapat
    if (editingId === m.id) {
      setEditingId(null);
      setEditingData(null);
      return;
    }
    setEditingId(m.id);
    setEditingData(m);
  };

  const stopEdit = () => {
    setEditingId(null);
    setEditingData(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between !mb-3">
        <h2 className="text-lg font-semibold">Takım Üyeleri</h2>
        <Button className="!p-2 !mb-1 " onClick={() => setCreating((v) => !v)}>
          {creating ? "Kapat" : "Yeni Üye"}
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Yeni Üye Ekle</h4>
          <TeamMemberForm onDone={() => setCreating(false)} />
        </div>
      )}

      {/* Empty state */}
      {!hasItems && !creating && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Henüz üye eklenmemiş. Başlamak için{" "}
          <span className="font-medium">“Yeni Üye”</span> butonuna tıkla.
        </div>
      )}

      {/* List */}
      {hasItems && (
        <div className="space-y-3">
          {items.map((m) => {
            const isEditingThis = editingId === m.id;

            return (
              <div key={m.id} className="border rounded-lg !mb-3">
                {/* Üye satırı */}
                <div className="flex items-center justify-between !p-2">
                  <div className="flex items-center gap-3">
                    {m.imageUrl ? (
                      <Image
                        src={m.imageUrl}
                        alt={m.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover h-12 w-12"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-muted" />
                    )}
                    <div>
                      <div className="font-medium">
                        {m.name}
                        {/* {m.isPresident && (
                          <span className="!ml-0.5 text-xs !px-1 py-0.5 rounded bg-zinc-900 text-white">
                            President
                          </span>
                        )}
                        {m.isCaptain && (
                          <span className="!ml-0.5 text-xs !px-1 py-0.5 rounded border">
                            Captain
                          </span>
                        )} */}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {m.role} {m.squad ? `· ${m.squad}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 !p-2">
                    <Button
                      className="!p-2 hover:bg-gray-300"
                      variant="secondary"
                      onClick={() => startEdit(m)}
                    >
                      {isEditingThis ? "Kapat" : "Düzenle"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => askDelete(m)}
                      disabled={isPending}
                      className="!p-3 hover:bg-red-500"
                    >
                      Sil
                    </Button>
                  </div>
                </div>

                {/* Düzenleme formu: ilgili satırın hemen altında */}
                {isEditingThis && editingData && (
                  <div className="border-t p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">
                      {editingData.name} – Düzenle
                    </h4>
                    <TeamMemberForm
                      initial={toFormInitial(editingData)}
                      onDone={stopEdit}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AlertDialog: Sil onayı */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="!text-center">
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? (
                <>
                  <span className="font-medium">{target.name}</span> adlı üyeyi
                  silmek üzeresiniz. Bu işlem geri alınamaz.
                </>
              ) : (
                "Bu işlem geri alınamaz."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* Siyah vazgeç butonu */}
            <AlertDialogCancel asChild>
              <Button className="bg-black text-white hover:bg-gray-800 hover:text-white !p-3 !m-1">
                Vazgeç
              </Button>
            </AlertDialogCancel>

            {/* Kırmızı sil butonu */}
            <AlertDialogAction asChild>
              <Button
                onClick={confirmDelete}
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 text-white !p-4 !m-1"
              >
                Sil
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
