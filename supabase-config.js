// supabase-config.js
// Muat file ini SETELAH library supabase-js dan SEBELUM script halaman Anda:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="supabase-config.js"></script>

const SUPABASE_URL = 'https://nzrjskgbcnbmilvzrqqr.supabase.co';

// Tempel kunci ANON / PUBLISHABLE di sini (boleh publik).
// JANGAN pernah menaruh kunci service_role / secret di file ini.
const SUPABASE_ANON_KEY = 'GANTI_DENGAN_KUNCI_ANON';

if (SUPABASE_ANON_KEY.startsWith('GANTI_')) {
  console.warn('supabase-config.js: kunci anon belum diisi.');
}

// Klien yang dipakai semua halaman: window.sb
window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Pembantu siap pakai --------------------------------------------------

// index.html: kartu statistik publik (tanpa login)
window.ambilStatistikPublik = async function () {
  const { data, error } = await window.sb.rpc('public_stats');
  if (error) { console.error('public_stats:', error.message); return null; }
  return data;
};

// dashboard.html: data statistik (perlu login). loginMt5 opsional untuk satu akun.
window.ambilDashboard = async function (loginMt5 = null) {
  const { data, error } = await window.sb.rpc('dashboard_data', { p_login: loginMt5 });
  if (error) { console.error('dashboard_data:', error.message); return null; }
  return data; // null jika belum ada akun aktif
};

// useradmin: ringkasan semua akun (hanya admin)
window.ambilRingkasanAdmin = async function () {
  const { data, error } = await window.sb.rpc('admin_overview');
  if (error) { console.error('admin_overview:', error.message); return null; }
  return data;
};

window.ubahStatusAkun = async function (uuidAkun, status) {
  const { error } = await window.sb.rpc('admin_set_status', { p_account: uuidAkun, p_status: status });
  if (error) throw new Error(error.message);
};

// Token kiriman data untuk EA; tampil sekali saja, simpan di PC yang menjalankan MT5.
window.buatTokenAkun = async function (uuidAkun) {
  const { data, error } = await window.sb.rpc('admin_issue_token', { p_account: uuidAkun });
  if (error) throw new Error(error.message);
  return data;
};
