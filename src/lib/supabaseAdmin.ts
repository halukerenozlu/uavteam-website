// src/lib/supabaseAdmin.ts

// import { createClient } from "@supabase/supabase-js";

// const url = process.env.SUPABASE_URL!;
// const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// if (!url || !serviceKey) {
//   throw new Error("Supabase env vars missing: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
// }

// export const supabaseAdmin = createClient(url, serviceKey, {
//   auth: { persistSession: false, autoRefreshToken: false },
// });

// Sonraki aşamada Supabase’i açmak için (hatırlatma)

//src/lib/supabaseAdmin.ts dosyası oluştur,

//.env’e SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET_NEWS ekle,

//actions.ts’teki yorumlu uploadNewsImage fonksiyonunu etkinleştir,

//Admin page.tsx’te onPickFile fonksiyonunu ve input’u enable et:

//disabled’ları kaldır,

//onChange={onPickFile} ekle,

//uploadBusy state’ini aktif et.

//Böylece bugün URL ile, yarın tek satır yorum kaldırarak PC’den yükleye geçebilirsin.
