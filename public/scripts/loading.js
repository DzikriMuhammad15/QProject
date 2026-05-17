// loading.js — global loading overlay helper
//
// showLoading()          → tampilkan overlay (blokir semua klik)
// hideLoading()          → sembunyikan overlay (hanya dipanggil saat ERROR)
// withLoading(asyncFn)   → jalankan async fn dengan loading otomatis
//
// PENTING: saat sukses, overlay TIDAK di-hide — biarkan tetap tampil
// sampai location.reload() selesai. hideLoading() hanya untuk kasus error
// agar user bisa melihat pesan dan mencoba lagi.

function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('active');
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('active');
}

// Jalankan asyncFn dengan loading overlay.
// Jika sukses → overlay tetap tampil (halaman akan reload).
// Jika error → overlay disembunyikan, error di-throw agar handler bisa menampilkan pesan.
async function withLoading(asyncFn) {
  showLoading();
  try {
    await asyncFn();
    // Sukses: jangan hideLoading() — biarkan overlay sampai reload selesai
  } catch (err) {
    hideLoading(); // Gagal: sembunyikan agar user bisa coba lagi
    throw err;
  }
}
