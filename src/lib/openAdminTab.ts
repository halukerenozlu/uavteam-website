// src/lib/openAdminTab.ts
export const ADMIN_URL = "/admin";
export const ADMIN_WINDOW_NAME = "kuasar-admin";

export function openAdminTab(e?: MouseEvent | React.MouseEvent) {
  // Link davranışını durdur
  e?.preventDefault?.();

  // Aynı isimli sekmeyi bul ya da aç
  const win = window.open(ADMIN_URL, ADMIN_WINDOW_NAME);

  if (win) {
    try {
      win.focus();
    } catch {
      /* bazı tarayıcılarda focus hata verebilir, önemsiz */
    }
  } else {
    // Pop-up engeli varsa fallback: aynı sekmede aç
    window.location.href = ADMIN_URL;
  }
}
