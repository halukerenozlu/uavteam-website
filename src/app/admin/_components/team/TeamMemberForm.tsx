// src/app/admin/_components/TeamMemberForm.tsx
"use client";

import { useState } from "react";
import type { MemberInput } from "@/lib/validation/teamMember"; // ✅ sadece tip
import { createMember, updateMember } from "@/app/admin/(panel)/team/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

type FormData = MemberInput;
type SquadValue = NonNullable<FormData["squad"]>; // "mechanical" | "avionics" | "software"

export default function TeamMemberForm({
  initial,
  onDone,
}: {
  initial?: Partial<FormData>;
  onDone?: () => void;
}) {
  const [values, setValues] = useState<FormData>({
    id: initial?.id,
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    squad: (initial?.squad ?? null) as FormData["squad"],
    isCaptain: initial?.isCaptain ?? false,
    isPresident: initial?.isPresident ?? false,
    imageUrl: initial?.imageUrl ?? "",
    linkedinUrl: initial?.linkedinUrl ?? "",
    order: (initial?.order as number) ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      if (values.id) {
        await updateMember(values);
      } else {
        await createMember(values);
      }
      onDone?.();
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: string }).message)
          : "Kayıt başarısız";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="grid gap-4 md:grid-cols-2 !p-2">
        <div>
          <Label className="!pb-1">İsim</Label>
          <Input
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            className="!p-1"
            required
          />
        </div>

        <div>
          <Label className="!pb-1">Rol</Label>
          <Input
            value={values.role ?? ""}
            className="!p-1"
            onChange={(e) => setValues({ ...values, role: e.target.value })}
          />
        </div>

        <div>
          <Label className="!pb-1">Squad</Label>
          <Select
            value={values.squad ?? ""} // null ise boş göster
            onValueChange={(v: string) =>
              setValues({
                ...values,
                squad: (v ? (v as SquadValue) : null) as FormData["squad"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent className="!p-2">
              <SelectItem value="mechanical">Mechanical</SelectItem>
              <SelectItem value="avionics">Avionics</SelectItem>
              <SelectItem value="software">Software</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="!pb-1">Sıra</Label>
          <Input
            type="number"
            value={values.order}
            className="!p-1"
            onChange={(e) =>
              setValues({ ...values, order: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="isCaptain"
            checked={values.isCaptain}
            onCheckedChange={(v) =>
              setValues({ ...values, isCaptain: Boolean(v) })
            }
          />
          <Label htmlFor="isCaptain">Team Captain</Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="isPresident"
            checked={values.isPresident}
            onCheckedChange={(v) =>
              setValues({ ...values, isPresident: Boolean(v) })
            }
          />
          <Label htmlFor="isPresident">President</Label>
        </div>

        <div className="md:col-span-2">
          <Label className="!pb-1">LinkedIn URL</Label>
          <Input
            placeholder="https://linkedin.com/in/..."
            value={values.linkedinUrl ?? ""}
            className="!p-1"
            onChange={(e) =>
              setValues({ ...values, linkedinUrl: e.target.value })
            }
          />
        </div>

        <div className="md:col-span-2">
          <Label className=" !ml-28">
            Avatar URL - Sadece LinkedIn, Github ve X
          </Label>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border bg-muted shrink-0">
              {values.imageUrl ? (
                <Image
                  src={values.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                  onError={() => setValues({ ...values, imageUrl: "" })}
                />
              ) : null}
            </div>
            <div className="flex-1">
              <Input
                placeholder="https://...jpg"
                value={values.imageUrl ?? ""}
                className="!p-1"
                onChange={(e) =>
                  setValues({ ...values, imageUrl: e.target.value })
                }
              />
              <div className="mt-2 flex gap-2 !pt-2 ">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setValues({ ...values, imageUrl: "" })}
                  className="!p-2 bg-red-600 text-white hover:bg-red-500"
                >
                  Avatarı Kaldır
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 !p-2">
        <Button
          className="!p-2 hover:bg-gray-800"
          type="submit"
          disabled={loading}
        >
          {values.id ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  );
}
