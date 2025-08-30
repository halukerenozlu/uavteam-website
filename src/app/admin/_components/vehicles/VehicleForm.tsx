// src/app/admin/_components/vehicles/VehicleForm.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type VehicleFormValues = {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string | null;
};

const DESC_MAX = 300;

// Yardımcılar
function isValidAbsoluteUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
const isLocalPath = (s: string) => s.startsWith("/");

export default function VehicleForm({
  initial,
  onSubmit,
  submitText = "Kaydet",
}: {
  // edit/create ayrımı için id opsiyonel
  initial?: Partial<VehicleFormValues> & { id?: string };
  onSubmit: (values: VehicleFormValues) => Promise<void> | void;
  submitText?: string;
}) {
  const [values, setValues] = React.useState<VehicleFormValues>({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    ...initial,
  });

  const [uploading, setUploading] = React.useState(false);
  const [importUrl, setImportUrl] = React.useState("");
  const [importing, setImporting] = React.useState(false);

  // Hata durumları
  const [formError, setFormError] = React.useState<string | null>(null);
  //fieldErrors
  const [, setFieldErrors] = React.useState<{ imageUrl?: string }>({});

  const isEditMode = Boolean(initial?.id);

  React.useEffect(() => {
    if (initial) setValues((v) => ({ ...v, ...initial }));
  }, [initial]);

  // ---- PC'den dosya yükleme (/api/uploads) ----
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Yükleme hatası");
      setValues((v) => ({ ...v, imageUrl: j.url }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Yükleme hatası");
      }
    } finally {
      setUploading(false);
    }
  }

  // ---- URL’den içe aktar (/api/uploads/by-url) ----
  async function importFromUrl() {
    if (!importUrl) return;
    setImporting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      if (!isValidAbsoluteUrl(importUrl)) {
        setFieldErrors({ imageUrl: "Geçerli bir dış URL giriniz." });
        return;
      }
      const res = await fetch("/api/uploads/by-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: importUrl }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "URL içe aktarılamadı");
      setValues((v) => ({ ...v, imageUrl: j.url }));
      setImportUrl("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("URL içe aktarma hatası");
      }
    } finally {
      setImporting(false);
    }
  }

  // ---- Submit öncesi basit doğrulama ----
  function validate(): boolean {
    const errs: { imageUrl?: string } = {};
    if (!values.imageUrl) {
      errs.imageUrl = "Görsel URL gerekli.";
    } else if (
      !(isLocalPath(values.imageUrl) || isValidAbsoluteUrl(values.imageUrl))
    ) {
      errs.imageUrl = "Geçerli bir URL veya /uploads/... yolu giriniz.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!validate()) return;

        const payload = { ...values, videoUrl: values.videoUrl || undefined };
        try {
          await onSubmit(payload); // create() hata verirse dışarıda throw ediyor
          // Yalnızca create modunda sıfırla
          if (!isEditMode) {
            setValues({
              title: "",
              description: "",
              imageUrl: "",
              videoUrl: "",
            });
            setImportUrl("");
            setFieldErrors({});
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setFormError(err.message);
          } else {
            setFormError("İşlem başarısız");
          }
        }
      }}
    >
      {/* Genel form hatası (örn. API hatası) */}
      {formError && <div className="text-sm text-red-600">{formError}</div>}

      {/* Başlık */}
      <div className="grid gap-2 !pb-2">
        <Label>Başlık</Label>
        <Input
          value={values.title || ""}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="Araç adı"
          className="!p-2"
          required
        />
      </div>

      {/* Açıklama */}
      <div className="grid gap-2 !pb-3">
        <Label>Açıklama</Label>
        <Textarea
          rows={4}
          maxLength={DESC_MAX}
          value={values.description || ""}
          placeholder={`Maksimum ${DESC_MAX} karakter`}
          className="resize-y !p-1"
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          required
        />
        <div className="text-xs text-muted-foreground text-right">
          {values.description?.length ?? 0}/{DESC_MAX}
        </div>
      </div>

      {/* GÖRSEL BLOĞU */}
      <div className="grid gap-3">
        <Label>Görsel</Label>

        {/* 1) PC'den yükle */}
        <div className="grid gap-2 !pb-0.5">
          <Input
            className="!p-1"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {uploading && (
            <span className="text-xs text-muted-foreground">Yükleniyor…</span>
          )}
        </div>

        {/* 2) URL’den içe aktar */}
        <div className="grid gap-2 !pb-0.5">
          <Label className="text-xs text-muted-foreground">
            URL’den içe aktar (dış linki indirip /uploads altına kaydeder)
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://... görsel URL"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              className="!p-2"
            />
            <Button
              className="!p-3"
              type="button"
              onClick={importFromUrl}
              disabled={importing}
            >
              {importing ? "İçe alınıyor…" : "İçe Al"}
            </Button>
          </div>
        </div>

        {/* 3) Manuel URL kutusu (opsiyonel) */}
        {/* <div className="grid gap-1 !pb-0.5">
          <Label className="text-xs text-muted-foreground">
            Veya doğrudan URL gir (Upload/İçe Al kullanmadan)
          </Label>
        </div>

        <Input
          value={values.imageUrl || ""}
          onChange={(e) => {
            setValues((v) => ({ ...v, imageUrl: e.target.value }));
            setFieldErrors((fe) => ({ ...fe, imageUrl: undefined }));
          }}
          placeholder="/uploads/xxx.jpg veya https://…"
          className={`!p-2 ${
            fieldErrors.imageUrl
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }`}
          required
        />
        {fieldErrors.imageUrl && (
          <p className="text-xs text-red-600">{fieldErrors.imageUrl}</p>
        )} */}

        {/* 4) Önizleme — yalnızca geçerli olduğunda render et */}
        {values.imageUrl && (
          <div className="mt-2 !pb-3">
            {isLocalPath(values.imageUrl) ||
            isValidAbsoluteUrl(values.imageUrl) ? (
              isLocalPath(values.imageUrl) ? (
                <Image
                  src={values.imageUrl}
                  alt="Önizleme"
                  width={160}
                  height={100}
                  className="h-24 w-40 object-cover rounded"
                  priority={false}
                />
              ) : (
                // Dış URL: next/image domain gereksiniminden kaçınmak için native <img>
                <Image
                  src={values.imageUrl}
                  alt="Önizleme"
                  width={160}
                  height={100}
                  className="h-24 w-40 object-cover rounded"
                  loading="lazy"
                  onError={() =>
                    setFieldErrors({
                      imageUrl: "Görsel yüklenemedi. URL’yi kontrol edin.",
                    })
                  }
                />
              )
            ) : (
              <p className="text-sm text-red-600">❌ Geçersiz URL</p>
            )}
          </div>
        )}
      </div>

      {/* Video URL (opsiyonel) */}
      <div className="grid gap-2 !pb-3 !pt-3">
        <Label>Video URL (opsiyonel)</Label>
        <Input
          value={values.videoUrl || ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, videoUrl: e.target.value }))
          }
          className="!p-2"
          placeholder="https://youtube.com/watch?v=…"
        />
      </div>

      <Button
        type="submit"
        disabled={uploading || importing}
        className="mt-2 bg-black !text-white hover:bg-gray-800 !px-5"
      >
        {submitText}
      </Button>
    </form>
  );
}
