"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  addSponsor,
  removeSponsor,
  getSponsors,
  updateSocial,
  deleteMyAccount,
  getApplyLinks,
  saveApplyLinks,
  getSocialLinks,
} from "@/app/admin/(panel)/control-center/actions";

// --- Tipler ---
type Sponsor = { id: string; imageUrl: string };
type SocialLabel = "Instagram" | "YouTube" | "LinkedIn";
type SocialItem = { label: SocialLabel; url: string; order?: number };

// Sosyal linkler için sabit etiketli boş başlangıç
const initialSocialFixed: SocialItem[] = [
  { label: "Instagram", url: "" },
  { label: "YouTube", url: "" },
  { label: "LinkedIn", url: "" },
];

export function ControlCenterCards() {
  // Sponsors (DB’den gelecek)
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [newSponsorUrl, setNewSponsorUrl] = useState("");

  // Sosyal linkler (label sabit)
  const [socialLinks, setSocialLinks] =
    useState<SocialItem[]>(initialSocialFixed);

  // Üyelik formları: 3 ayrı alan
  const [mechForm, setMechForm] = useState("");
  const [avionicForm, setAvionicForm] = useState("");
  const [softwareForm, setSoftwareForm] = useState("");

  const [isPending, startTransition] = useTransition();
  const disabled = isPending;
  const [formMsg, setFormMsg] = useState<string | null>(null);

  // ---- İlk yükte sponsorları DB'den getir
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getSponsors();
        if (!mounted) return;
        setSponsors(list.map((s) => ({ id: s.id, imageUrl: s.imageUrl })));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---- İlk yükte formları DB'den getir
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const links = await getApplyLinks();
        if (!mounted) return;
        setMechForm(links.mechanical || "");
        setAvionicForm(links.avionic || "");
        setSoftwareForm(links.software || "");
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---- İlk yükte sosyal linkleri getir
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getSocialLinks();
        if (!mounted) return;
        if (res.ok) {
          const order: SocialLabel[] = ["Instagram", "YouTube", "LinkedIn"];
          const map = new Map(res.data.map((x) => [x.label, x]));
          setSocialLinks(
            order.map(
              (l) => map.get(l) ?? ({ label: l, url: "" } as SocialItem)
            )
          );
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // --- Sponsorlar ---
  const onAddSponsor = () => {
    if (!newSponsorUrl.trim()) return;
    startTransition(async () => {
      const res = await addSponsor(newSponsorUrl.trim());
      if (res.ok) {
        setSponsors((prev) => [
          ...prev,
          { id: res.data.id, imageUrl: res.data.imageUrl },
        ]);
        setNewSponsorUrl("");
      } else {
        console.error(res.error || "Sponsor eklerken hata");
      }
    });
  };

  const onRemoveSponsor = (id: string) => {
    startTransition(async () => {
      const res = await removeSponsor(id);
      if (res.ok) {
        setSponsors((prev) => prev.filter((s) => s.id !== id));
      } else {
        console.error(res.error ?? "Sponsor silerken hata");
      }
    });
  };

  // --- Sosyal Linkler ---
  const onSocialUrlChange = (label: SocialLabel, value: string) => {
    setSocialLinks((prev) =>
      prev.map((s) => (s.label === label ? { ...s, url: value } : s))
    );
  };

  const onSaveSocial = () => {
    startTransition(async () => {
      const payload = socialLinks.map((s, i) => ({
        label: s.label,
        url: s.url.trim(),
        order: i,
      }));
      const res = await updateSocial(payload);
      if (!res.ok)
        console.error(res.error ?? "Sosyal linkleri güncellerken hata");
    });
  };

  // --- Üyelik Formları ---
  const onSaveApplyForms = () => {
    setFormMsg(null);
    startTransition(async () => {
      const res = await saveApplyLinks({
        mechanical: mechForm.trim(),
        avionic: avionicForm.trim(),
        software: softwareForm.trim(),
      });
      if (res.ok) setFormMsg("Güncellendi.");
      else setFormMsg(res.error || "Kaydedilemedi.");
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {/* Sponsors */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-center !pt-2">Sponsorlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 !p-2">
            <Input
              placeholder="Görsel URL'si (https://...)"
              value={newSponsorUrl}
              onChange={(e) => setNewSponsorUrl(e.target.value)}
            />
            <Button className="!p-2" onClick={onAddSponsor} disabled={disabled}>
              Ekle
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 !p-2">
            {sponsors.map((s) => (
              <div
                key={s.id}
                className="border rounded-lg !p-2 flex items-center justify-between gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl}
                  alt="Sponsor"
                  className="h-10 w-20 object-contain"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="!p-3"
                  onClick={() => onRemoveSponsor(s.id)}
                  disabled={disabled}
                >
                  Sil
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-center !pt-2 !pb-5">
            Sosyal Medya Linkleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {socialLinks.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-1 md:grid-cols-5 gap-2"
              >
                <div className="md:col-span-2 !p-2 flex items-center">
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                <div className="md:col-span-3 !p-2">
                  <Label className="sr-only">URL</Label>
                  <Input
                    value={s.url}
                    onChange={(e) => onSocialUrlChange(s.label, e.target.value)}
                    placeholder="https://..."
                    className="!mb-2 !p-1"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center !p-5 !pb-3">
            <Button className="!p-3" onClick={onSaveSocial} disabled={disabled}>
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Membership Forms */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-center !pt-2">
            Üyelik Form Linkleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 !p-2">
          <div className="space-y-3">
            <div className="space-y-1.5 ">
              <Label className="!p-1">Mechanical</Label>
              <Input
                value={mechForm}
                onChange={(e) => setMechForm(e.target.value)}
                placeholder="https://forms.gle/..."
                className="!mb-2 !p-1"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="!p-1">Avionic</Label>
              <Input
                value={avionicForm}
                onChange={(e) => setAvionicForm(e.target.value)}
                placeholder="https://forms.gle/..."
                className="!mb-2 !p-1"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="!p-1">Software</Label>
              <Input
                value={softwareForm}
                onChange={(e) => setSoftwareForm(e.target.value)}
                placeholder="https://forms.gle/..."
                className="!mb-2 !p-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center !p-3">
            <Button
              className="!p-2"
              onClick={onSaveApplyForms}
              disabled={disabled}
            >
              Güncelle
            </Button>
            {formMsg && (
              <span className="text-sm text-muted-foreground">{formMsg}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions - AlertDialog ile onaylı silme */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={disabled}
            className="col-span-full !m-auto !mt-12 !mb-6 !p-4 lg:col-start-2 lg:col-end-3 xl:col-start-2 xl:col-end-3"
          >
            Hesabımı Sil
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="!p-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Bu işlem geri alınamaz. Hesabınız kalıcı olarak silinecek ve
              oturumunuz kapatılacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="!p-2">Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              className="!p-2"
              onClick={() =>
                startTransition(async () => {
                  const res = await deleteMyAccount();
                  if (!res.ok) {
                    console.error(res.error ?? "Hesap silinemedi");
                  } else {
                    window.location.href = "/admin";
                  }
                })
              }
            >
              Hesabı Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
