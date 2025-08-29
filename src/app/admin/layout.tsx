// src/app/admin/layout.tsx

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
