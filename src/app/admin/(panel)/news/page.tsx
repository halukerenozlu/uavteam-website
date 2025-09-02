// src/app/admin/(panel)/news/page.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { DEFAULT_CARD_IMAGE } from "@/constants/images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  createNewsCard,
  deleteNewsCard,
  getNewsCards,
  updateNewsCard,
  // uploadNewsImage, // (SONRA) Supabase'i açınca aktif et
} from "./actions";
import {
  FaGlobe,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaRegNewspaper,
} from "react-icons/fa";
import type { ComponentType } from "react";
import type { HomeCard, HomeCardLink } from "@prisma/client";
import type { $Enums } from "@prisma/client"; // Prisma enum tipi

type LinkTypeEnum = $Enums.LinkType; // "WEB" | "INSTAGRAM" | ...

const linkTypes = [
  "WEB",
  "INSTAGRAM",
  "YOUTUBE",
  "X",
  "LINKEDIN",
  "NEWS",
] as const;
type LinkTypeLiteral = (typeof linkTypes)[number];

// Formda kullanacağımız link tipi: id opsiyonel
type LinkItem = { id?: string; type: LinkTypeEnum; url: string };

// UI'da göstereceğimiz satır tipi
type CardRow = HomeCard & { links: LinkItem[] };

// Server'dan gelen ham tip
type ServerCard = HomeCard & { links: HomeCardLink[] };

const LinkIconMap: Record<
  LinkTypeLiteral,
  ComponentType<{ className?: string }>
> = {
  WEB: FaGlobe,
  INSTAGRAM: FaInstagram,
  YOUTUBE: FaYoutube,
  X: FaTwitter,
  LINKEDIN: FaLinkedin,
  NEWS: FaRegNewspaper,
};

export default function NewsDashboardPage() {
  const [rows, setRows] = useState<CardRow[]>([]);
  const [isPending, startTransition] = useTransition();

  // form
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyForm = useMemo(
    () => ({
      title: "",
      content: "",
      imageUrl: "",
      order: 0,
      isActive: true,
      links: [] as LinkItem[],
    }),
    []
  );
  const [form, setForm] = useState(emptyForm);

  // const [uploadBusy, setUploadBusy] = useState(false); // (SONRA) Supabase için

  useEffect(() => {
    startTransition(async () => {
      const data = (await getNewsCards()) as ServerCard[];
      // Server’dan gelen HomeCardLink[] -> LinkItem[]’a normalize
      const normalized: CardRow[] = data.map((d) => ({
        ...d,
        links: (d.links || []).map(({ id, type, url }) => ({ id, type, url })),
      }));
      setRows(normalized);
    });
  }, []);

  // type-safe field setter
  const onChangeField = <K extends keyof typeof form>(
    k: K,
    v: (typeof form)[K]
  ) => setForm((f) => ({ ...f, [k]: v }));

  // Aynı türden ikinci link eklemeyi UI tarafında engelle
  const optionsForIndex = (idx: number): LinkTypeLiteral[] => {
    const usedTypes = new Set(
      form.links
        .map((l, i) => (i === idx ? null : (l.type as LinkTypeLiteral)))
        .filter(Boolean) as LinkTypeLiteral[]
    );
    return linkTypes.filter((t) => !usedTypes.has(t));
  };

  const addLink = () => {
    const used = new Set(form.links.map((l) => l.type));
    const avail = linkTypes.find((t) => !used.has(t as LinkTypeEnum));
    if (!avail) {
      alert("Tüm link türleri zaten ekli.");
      return;
    }
    setForm((f) => ({
      ...f,
      links: [...f.links, { type: avail as LinkTypeEnum, url: "" }],
    }));
  };

  const removeLink = (i: number) =>
    setForm((f) => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }));

  const updateLink = (i: number, patch: Partial<LinkItem>) =>
    setForm((f) => ({
      ...f,
      links: f.links.map((x, idx) => (idx === i ? { ...x, ...patch } : x)),
    }));

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const onSubmit = async () => {
    if (!form.title.trim()) return alert("Başlık gerekli");
    if (!form.imageUrl.trim()) return alert("Görsel URL gerekli");
    if (form.content.length > 500)
      return alert("İçerik 500 karakteri geçmemeli");

    startTransition(async () => {
      if (editingId) {
        await updateNewsCard(editingId, {
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl,
          order: form.order,
          isActive: form.isActive,
          links: form.links,
        });
      } else {
        await createNewsCard({
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl,
          order: form.order,
          isActive: form.isActive,
          links: form.links,
        });
      }
      const data = (await getNewsCards()) as ServerCard[];
      const normalized: CardRow[] = data.map((d) => ({
        ...d,
        links: (d.links || []).map(({ id, type, url }) => ({ id, type, url })),
      }));
      setRows(normalized);
      resetForm();
    });
  };

  const onEdit = (r: CardRow) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      content: r.content,
      imageUrl: r.imageUrl,
      order: r.order,
      isActive: r.isActive,
      links: (r.links || []).map((l) => ({
        id: l.id,
        type: l.type,
        url: l.url,
      })),
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Bu kart silinsin mi?")) return;
    startTransition(async () => {
      await deleteNewsCard(id);
      const data = (await getNewsCards()) as ServerCard[];
      const normalized: CardRow[] = data.map((d) => ({
        ...d,
        links: (d.links || []).map(({ id, type, url }) => ({ id, type, url })),
      }));
      setRows(normalized);
    });
  };

  // // ---- (SONRA) PC'den yükle → Supabase'e gönder
  // const onPickFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
  //   const f = ev.target.files?.[0];
  //   if (!f) return;
  //   setUploadBusy(true);
  //   try {
  //     const res = await uploadNewsImage(f);
  //     onChangeField("imageUrl", res.url);
  //   } catch {
  //     alert("Yükleme başarısız");
  //   } finally {
  //     setUploadBusy(false);
  //     ev.target.value = "";
  //   }
  // };

  return (
    <main className="min-h-svh !pt-20 !m-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle className="!p-2">
              {editingId ? "Kartı Düzenle" : "Yeni Kart Ekle"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 !p-2">
              <Label>Başlık</Label>
              <Input
                value={form.title}
                onChange={(e) => onChangeField("title", e.target.value)}
                className="!p-1"
                placeholder="Kısa başlık"
              />
            </div>

            <div className="grid gap-3 !p-2">
              <Label>İçerik (max 500)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => onChangeField("content", e.target.value)}
                rows={4}
                maxLength={500}
                className="!p-1"
                placeholder="Kısa açıklama"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4 items-end !p-2">
              <div className="md:col-span-2 grid gap-3">
                <Label>Görsel URL</Label>
                <Input
                  value={form.imageUrl || DEFAULT_CARD_IMAGE}
                  onChange={(e) => onChangeField("imageUrl", e.target.value)}
                  placeholder="https://..."
                  className="!p-2"
                />
              </div>

              {/* PC'den yükle alanı (şimdilik pasif) */}
              <div className="grid gap-2">
                <Label>PC den yükle</Label>
                <div className="opacity-60">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="news-file"
                    disabled
                  />
                  <Button
                    asChild
                    variant="outline"
                    className="justify-center"
                    disabled
                  >
                    <label htmlFor="news-file" className="cursor-not-allowed">
                      {/* <Upload className="h-4 w-4 mr-2 inline-block" /> */}
                      (Yakında) Dosya seç
                    </label>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Not: Supabase i aktifleştirince burası çalışacak.
                </p>
              </div>
            </div>

            {/* Preview */}
            {form.imageUrl && (
              <div className="relative h-40 w-full overflow-hidden rounded-xl border">
                <Image
                  src={form.imageUrl || DEFAULT_CARD_IMAGE}
                  alt="Önizleme"
                  fill
                  className="object-cover"
                  unoptimized
                  onError={() => onChangeField("imageUrl", "")}
                />
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 !p-2">
              <div className="grid gap-3">
                <Label>Sıra</Label>
                <Input
                  type="number"
                  value={form.order}
                  className="!p-2"
                  onChange={(e) =>
                    onChangeField("order", Number(e.target.value))
                  }
                />
              </div>
              <div className="grid gap-3">
                <Label>Aktif mi?</Label>
                <Select
                  value={form.isActive ? "1" : "0"}
                  onValueChange={(v) => onChangeField("isActive", v === "1")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Aktif</SelectItem>
                    <SelectItem value="0">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Links repeater */}
            <div className="space-y-2 !p-2">
              <div className="flex items-center justify-between">
                <Label>Bağlantılar</Label>
                <Button
                  className="!p-2 hover:bg-gray-400"
                  type="button"
                  variant="secondary"
                  onClick={addLink}
                  disabled={form.links.length >= 6}
                >
                  Bağlantı Ekle
                </Button>
              </div>
              <div className="space-y-3">
                {form.links.map((l: LinkItem, i: number) => {
                  const Icon =
                    LinkIconMap[l.type as LinkTypeLiteral] || FaGlobe;
                  return (
                    <div
                      key={l.id ?? i}
                      className="grid md:grid-cols-12 gap-3 items-end"
                    >
                      <div className="md:col-span-3">
                        <Label className="mb-1 block !p-1">Tür</Label>
                        <Select
                          value={l.type}
                          onValueChange={(v) =>
                            updateLink(i, { type: v as LinkTypeEnum })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {optionsForIndex(i).map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-6">
                        <Label className="mb-1 block !p-1">URL</Label>
                        <Input
                          value={l.url}
                          className="!p-1 !mb-1"
                          onChange={(e) =>
                            updateLink(i, { url: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                      <div className="md:col-span-3 flex gap-2">
                        <Button type="button" variant="ghost" asChild>
                          <a
                            href={l.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Önizleme"
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="!p-3 hover:bg-red-500"
                          onClick={() => removeLink(i)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 !p-2">
              <Button
                className="!p-2 hover:bg-gray-600"
                onClick={onSubmit}
                disabled={isPending}
              >
                {editingId ? "Kaydet" : "Ekle"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Vazgeç
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* LİSTE */}
        <Card>
          <CardHeader className="!p-2">
            <CardTitle>Mevcut Kartlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 !p-2">
            {rows.length === 0 && (
              <p className="text-sm text-muted-foreground">Henüz kart yok.</p>
            )}
            <div className="grid gap-4">
              {rows.map((r: CardRow) => (
                <div
                  key={r.id}
                  className="grid md:grid-cols-12 gap-3 p-3 rounded-xl border items-center"
                >
                  <div className="relative h-20 w-full md:col-span-2 overflow-hidden rounded-lg">
                    <Image
                      src={r.imageUrl || DEFAULT_CARD_IMAGE}
                      alt={r.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <div className="font-medium line-clamp-1">{r.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {r.content}
                    </div>
                    {r.links?.length > 0 && (
                      <div className="mt-1 flex gap-2">
                        {r.links.map((l: LinkItem, idx: number) => {
                          const Ico =
                            LinkIconMap[l.type as LinkTypeLiteral] || FaGlobe;
                          return <Ico key={l.id ?? idx} className="h-4 w-4" />;
                        })}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-3 text-sm">
                    Sıra: {r.order} • {r.isActive ? "Aktif" : "Pasif"}
                  </div>
                  <div className="md:col-span-2 flex gap-2 justify-end !p-2">
                    <Button
                      className="!p-2 hover:bg-gray-400"
                      variant="secondary"
                      onClick={() => onEdit(r)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="destructive"
                      className="!p-3 hover:bg-red-500"
                      onClick={() => onDelete(r.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
