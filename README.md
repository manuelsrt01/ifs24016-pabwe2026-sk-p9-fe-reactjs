# Delcom Blog — Frontend Multi-Tier SPA (ReactJS, Vite, Tailwind CSS & Toast UI Editor)

Repositori Frontend Studi Kasus Praktikum PABWE 2026 Modul P9: **Delcom Blog — Platform Publikasi Artikel Multi-Tier dengan AI Content Generator dan Integrasi Search Engine**.

Dibangun menggunakan **ReactJS**, **Vite**, **Tailwind CSS**, **Toast UI Markdown Editor & Viewer**, **SweetAlert2**, dan **Vitest + React Testing Library** dengan **100% Code Coverage** (Statements, Branches, Functions, Lines).

---

## 1. Struktur Folder Frontend

```text
ifs24016-pabwe2026-sk-p9-fe-reactjs/
├── src/
│   ├── main.jsx                              # React DOM root entry point
│   ├── index.css                             # Tailwind CSS styling
│   ├── setupTests.js                         # JSDOM polyfills untuk Toast UI & Vitest
│   ├── App.jsx                               # Orkestrator SPA routing & session state
│   ├── components/
│   │   ├── MarkdownEditor.jsx                # Toast UI Editor wrapper
│   │   └── MarkdownViewer.jsx                # Toast UI Viewer wrapper
│   ├── helpers/
│   │   ├── apiHelper.js                      # Wrapper fetch terpusat & Bearer token
│   │   └── toolsHelper.js                    # Dialog SweetAlert2 & format tanggal
│   ├── hooks/
│   │   ├── useInput.js                       # Custom hook form input state
│   │   └── useTheme.js                       # Custom hook tema light/dark & aksen
│   └── features/
│       ├── admin/
│       │   ├── api/adminApi.js               # API monitoring pengguna & artikel
│       │   └── components/AdminDashboard.jsx # Admin Panel Full Width
│       ├── auth/
│       │   ├── api/authApi.js                # API login, register, logout, profil
│       │   ├── components/AuthPage.jsx       # Halaman login & register mandiri
│       │   └── modals/AuthModal.jsx          # Modal login cepat (#login-username)
│       └── blog/
│           ├── api/blogApi.js                # API artikel publik, CRUD penulis, stats, AI
│           ├── components/
│           │   ├── StickyNavbar.jsx          # Sticky top navbar tanpa sidebar
│           │   ├── PublicArticleList.jsx     # Galeri publik + search + filter pill kategori
│           │   ├── PublicArticleDetail.jsx   # Ruang baca artikel Full Width + MarkdownViewer
│           │   ├── AuthorDashboard.jsx       # Workspace penulis Full Width + menu kebab (⋮)
│           │   └── PostStats.jsx             # 3 kartu statistik (Total, Terbit, Draf)
│           └── modals/
│               ├── PostModal.jsx             # Modal Full Screen editor artikel
│               └── AiPostGeneratorModal.jsx  # Modal Full Screen AI Blog Generator + Search Engine
├── index.html
├── package.json
├── vite.config.js
├── Jenkinsfile
└── README.md
```

---

## 2. Tiga Tingkatan Antarmuka (Multi-Tier UI) & Rute SPA

| Rute SPA | Komponen | Hak Akses | Fitur Utama |
| :--- | :--- | :--- | :--- |
| `/` atau `/public` | `PublicArticleList.jsx` | Publik (Guest) | Sticky Top Navbar tanpa sidebar, pencarian artikel real-time, filter pill kategori (`Semua`, `Teknologi`, `Pendidikan`, `Gaya Hidup`, `Bisnis`, `Opini`, `Umum`), estimasi waktu baca. |
| `/posts/:slug` | `PublicArticleDetail.jsx` | Publik (Guest) | Tata letak Full Width, metadata penulis, estimasi waktu baca, dan render isi artikel via `MarkdownViewer`. |
| `/author` | `AuthorDashboard.jsx` | Penulis (Login) | Workspace Full Width, 3 kartu statistik (`Total Artikel`, `Total Selesai / Terbit`, `Belum Selesai / Draf`), toggle status publikasi instan, menu kebab (`⋮`), modal Full Screen `PostModal` dan `AiPostGeneratorModal`. |
| `/admin` | `AdminDashboard.jsx` | Admin Only | Panel administrasi Full Width, statistik pengguna, tabel direktori pengguna (ID, username, email, role, total artikel, total terbit), inspeksi artikel per pengguna, dan arsip seluruh artikel sistem. |
| `/login` | `AuthPage.jsx` | Publik | Halaman login mandiri dengan atribut wajib `id="login-username"`, `id="login-password"`, dan `id="login-submit"`. |
| `/register` | `AuthPage.jsx` | Publik | Halaman pendaftaran akun penulis baru. |

---

## 3. Cara Menjalankan, Menguji & Build Production

### Instalasi Dependensi
```bash
cd ifs24016-pabwe2026-sk-p9-fe-reactjs
npm install
```

### Menjalankan Vite Development Server (Port 5174)
Pastikan backend Golang Gin sudah berjalan pada `http://localhost:8081`. Vite akan mem-proxy seluruh request `/api` ke `http://localhost:8081`.
```bash
npm run dev
```
Buka browser pada alamat: `http://localhost:5174`

### Menjalankan Unit Testing & Verifikasi 100% Code Coverage
```bash
npm test
```

### Build Production
```bash
npm run build
```
