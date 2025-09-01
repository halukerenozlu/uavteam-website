"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import VehicleForm, {
  type VehicleFormValues,
} from "../../_components/vehicles/VehicleForm";

type VehicleRow = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string | null;
  createdAt: string;
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store", credentials: "include" }).then((r) =>
    r.json()
  );

export default function VehiclesDashboard() {
  const { data, isLoading, mutate } = useSWR<VehicleRow[]>(
    "/api/vehicles",
    fetcher
  );
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<VehicleRow | null>(null);

  const list = React.useMemo(
    () =>
      (data || []).filter((v) =>
        v.title.toLowerCase().includes(query.toLowerCase())
      ),
    [data, query]
  );

  async function create(values: VehicleFormValues) {
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Oluşturulamadı"); // <-- alert yerine throw
    }
    await mutate();
  }

  async function update(id: string, values: Partial<VehicleFormValues>) {
    const res = await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });
    if (!res.ok) return alert("Güncellenemedi");
    setEditing(null);
    await mutate();
  }

  async function remove(id: string) {
    // AlertDialog onayı butonda alınıyor; burada native confirm yok.
    const res = await fetch(`/api/vehicles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return alert("Silinemedi");
    await mutate();
  }

  return (
    <main className="min-h-svh !pt-10 !m-6">
      <div className="space-y-4">
        {/* Sol: Liste (üstünde arama satırı + tablo) */}
        <div className=" bg-card/50 overflow-hidden">
          {/* Liste başlığı / arama satırı */}
          <div className="!p-2  bg-background/60">
            <Input
              placeholder="Araç ara…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full !p-1.5 border-gray-900"
            />
          </div>

          {/* İki sütun: Sol liste, sağ form paneli */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-20">
            {/* Liste */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Önizleme</TableHead>
                    <TableHead>Başlık</TableHead>
                    <TableHead className="text-right !pr-14">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={4}>Yükleniyor…</TableCell>
                    </TableRow>
                  )}

                  {(list || []).map((v, i) => (
                    <TableRow key={v.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Image
                          src={v.imageUrl}
                          alt={v.title}
                          className="h-10 w-16 object-cover rounded"
                          width={160}
                          height={100}
                        />
                      </TableCell>
                      {/* UZUN BAŞLIKLAR SARILSIN */}
                      <TableCell className="font-medium whitespace-normal break-words">
                        {v.title}
                      </TableCell>
                      <TableCell className="text-right space-x-2 !p-5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(v)}
                          className="!p-2 !mr-3 hover:bg-gray-300"
                        >
                          Düzenle
                        </Button>

                        {/* SİL: AlertDialog ile onay */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="!p-3 hover:bg-red-500"
                            >
                              Sil
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="!p-2 text-center">
                                Emin misiniz?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="!p-2 text-center">
                                Bu işlem geri alınamaz. Aracı silmek üzeresiniz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="!p-3 !m-2">
                                İptal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 !p-3 !m-2"
                                onClick={() => remove(v.id)}
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!isLoading && list.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>Kayıt yok</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Sağ Panel: her zaman açık */}
            <div className="  !p-2 h-fit sticky top-16 self-start">
              {editing ? (
                <>
                  <h2 className="text-lg font-semibold !mb-4">Aracı Düzenle</h2>
                  <VehicleForm
                    key={`edit-${editing.id}`}
                    initial={editing}
                    onSubmit={(vals) => update(editing.id, vals)}
                    submitText="Güncelle"
                  />
                  <div className="!pt-3">
                    <Button
                      className="!p-2"
                      variant="outline"
                      onClick={() => setEditing(null)}
                    >
                      İptal
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-3 !pb-2 text-center">
                    Yeni Araç Ekle
                  </h2>
                  <VehicleForm
                    key="create"
                    onSubmit={create}
                    submitText="Ekle"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
