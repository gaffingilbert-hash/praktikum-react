
import { useEffect, useRef, useState } from "react";
import "./App.css";

const mataKuliah = [
  { id: 1, nama: "Pemrograman Web", sks: 3, dosen: "DDr. Puspaningtyas Sanjoyo Adi, S.T., M.T." },
  { id: 2, nama: "Aljabar Linear", sks: 3, dosen: "Eko Hari Parmadi, S.Si., M.Kom" },
  { id: 3, nama: "Pembelajaran Mesin", sks: 2, dosen: "Dr. Sri Hartati Wijono" },
  { id: 4, nama: "Menejemen Data", sks: 3, dosen: "Ir. Paulina Heruningsih Prima Rosa, S.Si., M.Sc" },
];

function Judul() {
  return (
    <header className="page-header">
      <p className="eyebrow">PEMROGRAMAN WEB</p>
      <h1>Praktikum React JS</h1>
      <p>Latihan komponen, props, state, event, form, dan daftar tugas.</p>
    </header>
  );
}

function ProfilMahasiswa({ nama, nim, prodi }) {
  return (
    <section>
      <h2>1. Profil Mahasiswa</h2>
      <p><strong>Nama:</strong> {nama}</p>
      <p><strong>NIM:</strong> {nim}</p>
      <p><strong>Program Studi:</strong> {prodi}</p>
    </section>
  );
}

function KartuMataKuliah({ mataKuliah }) {
  return (
    <article className="course-card">
      <h3>{mataKuliah.nama}</h3>
      <p>Jumlah SKS: {mataKuliah.sks}</p>
      <p>{mataKuliah.dosen}</p>
    </article>
  );
}

function PenghitungKehadiran() {
  const [jumlah, setJumlah] = useState(0);

  function tambah() {
    setJumlah((nilai) => Math.min(30, nilai + 1));
  }

  function kurangi() {
    setJumlah((nilai) => Math.max(0, nilai - 1));
  }

  return (
    <section>
      <h2>3. Penghitung Kehadiran</h2>
      <p className="attendance-number">{jumlah} <span>/ 30</span></p>
      <div className="button-group">
        <button onClick={kurangi} disabled={jumlah === 0}>Kurangi</button>
        <button onClick={tambah} disabled={jumlah === 30}>Tambah</button>
        <button className="secondary" onClick={() => setJumlah(0)}>Reset</button>
      </div>
      <p className="hint">Nilai minimum 0 dan maksimum 30.</p>
    </section>
  );
}

function bacaTugasAwal() {
  try {
    const data = localStorage.getItem("daftar-tugas-kuliah");

    if (data === null) {
      return [];
    }

    const hasil = JSON.parse(data);

    if (
      !Array.isArray(hasil) ||
      !hasil.every(
        (tugas) =>
          tugas &&
          typeof tugas.id === "string" &&
          typeof tugas.title === "string" &&
          typeof tugas.completed === "boolean"
      )
    ) {
      return [];
    }

    return hasil;
  } catch {
    return [];
  }
}

function DaftarTugas() {
  const [tugas, setTugas] = useState(bacaTugasAwal);
  const [judulBaru, setJudulBaru] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [editId, setEditId] = useState(null);
  const [judulEdit, setJudulEdit] = useState("");
  const inputEditRef = useRef(null);
  const simpanAwal = useRef(true);

  useEffect(() => {
    if (simpanAwal.current) {
      simpanAwal.current = false;
      return;
    }

    try {
      localStorage.setItem("daftar-tugas-kuliah", JSON.stringify(tugas));
    } catch {
      console.error("Tugas tidak dapat disimpan ke localStorage.");
    }
  }, [tugas]);

  useEffect(() => {
    if (editId !== null) {
      inputEditRef.current?.focus();
    }
  }, [editId]);

  function tambahTugas(e) {
    e.preventDefault();
    const judul = judulBaru.trim();

    if (!judul) {
      alert("Judul tugas tidak boleh kosong.");
      return;
    }

    setTugas((daftar) => [
      ...daftar,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: judul,
        completed: false,
      },
    ]);
    setJudulBaru("");
  }

  function ubahStatus(id) {
    setTugas((daftar) =>
      daftar.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function hapusTugas(id) {
    setTugas((daftar) => daftar.filter((item) => item.id !== id));

    if (editId === id) {
      setEditId(null);
      setJudulEdit("");
    }
  }

  function mulaiEdit(item) {
    setEditId(item.id);
    setJudulEdit(item.title);
  }

  function simpanEdit(e) {
    e.preventDefault();
    const judul = judulEdit.trim();

    if (!judul) {
      alert("Judul tugas tidak boleh kosong.");
      return;
    }

    setTugas((daftar) =>
      daftar.map((item) =>
        item.id === editId ? { ...item, title: judul } : item
      )
    );

    setEditId(null);
    setJudulEdit("");
  }

  function batalkanEdit() {
    setEditId(null);
    setJudulEdit("");
  }

  const tugasTampil = tugas.filter((item) => {
    if (filter === "Aktif") return !item.completed;
    if (filter === "Selesai") return item.completed;
    return true;
  });

  return (
    <section>
      <h2>4. Daftar Tugas Kuliah</h2>

      <form className="task-form" onSubmit={tambahTugas}>
        <input
          type="text"
          value={judulBaru}
          onChange={(e) => setJudulBaru(e.target.value)}
          placeholder="Masukkan judul tugas..."
          aria-label="Judul tugas baru"
        />
        <button type="submit">Tambah Tugas</button>
      </form>

      <div className="filter-buttons">
        {["Semua", "Aktif", "Selesai"].map((namaFilter) => (
          <button
            key={namaFilter}
            type="button"
            className={filter === namaFilter ? "filter active" : "filter"}
            onClick={() => setFilter(namaFilter)}
          >
            {namaFilter}
          </button>
        ))}
      </div>

      <p className="task-summary">
        Total: {tugas.length} · Aktif: {tugas.filter((item) => !item.completed).length} · Selesai: {tugas.filter((item) => item.completed).length}
      </p>

      {tugasTampil.length === 0 ? (
        <p className="empty-state">Belum ada tugas pada kategori ini.</p>
      ) : (
        <ul className="task-list">
          {tugasTampil.map((item) => (
            <li className="task-item" key={item.id}>
              {editId === item.id ? (
                <form className="edit-form" onSubmit={simpanEdit}>
                  <input
                    ref={inputEditRef}
                    value={judulEdit}
                    onChange={(e) => setJudulEdit(e.target.value)}
                    aria-label="Edit judul tugas"
                  />
                  <button type="submit">Simpan</button>
                  <button type="button" className="secondary" onClick={batalkanEdit}>
                    Batal
                  </button>
                </form>
              ) : (
                <>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => ubahStatus(item.id)}
                    />
                    <span className={item.completed ? "completed" : ""}>
                      {item.title}
                    </span>
                  </label>
                  <div className="task-actions">
                    <button type="button" className="secondary" onClick={() => mulaiEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => hapusTugas(item.id)}>
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Footer() {
  return <footer>Praktikum Pemrograman Web · React JS</footer>;
}

export default function App() {
  const nama = "Gilbert Gaffin Pramudya";
  const nim = "255314086";
  const prodi = "Informatika";

  return (
    <main className="app">
      <Judul />

      <ProfilMahasiswa nama={nama} nim={nim} prodi={prodi} />

      <section>
        <h2>2. Daftar Mata Kuliah</h2>
        <div className="course-list">
          {mataKuliah.map((item) => (
            <KartuMataKuliah key={item.id} mataKuliah={item} />
          ))}
        </div>
      </section>

      <PenghitungKehadiran />
      <DaftarTugas />
      <Footer />
    </main>
  );
}
