On-Demand App MarFood melayani delivery makanan dengan motto #MakanDimanaja

> Routes

|Method | Route | Description |
| :----- | :--------- | :------------------------------------------------------------------------------- |
| GET | / | Landing page |
| GET | /login | Login page |
| POST | /login | Login page |
| GET | /register | Mendaftarkan user |
| POST | /register | Menambahkan user |
| GET | / | Halaman awal jika user berhasil login (pakai session) |
| GET | /categories | Menampilkan kategori menu |
| GET | /categories/food | Menampilkan daftar menu dengan kategori makanan |
| POST | /categories/food | Menambahkan menu dengan kategori makanan ke keranjang |
| GET | /categories/drink | Menampilkan daftar menu dengan kategori minuman |
| POST | /categories/drink | Menambahkan menu dengan kategori minuman ke keranjang |
| GET | /cart | Keranjang berisi menu yang sudah ditambahkan |
| POST | /cart | Menambahkan ke keranjang |
| GET | /success | Halaman berhasil checkout, menampilkan invoice |
| GET | /profile | Halaman profil user |
| GET | /edituser | Halaman edit profil user |
| POST | /edituser | Menambahkan perubahan profil user|

