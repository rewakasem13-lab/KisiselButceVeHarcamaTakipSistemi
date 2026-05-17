const form = document.getElementById("harcamaForm");
const harcamaListesi = document.getElementById("harcamaListesi");
const aramaInput = document.getElementById("aramaInput");
const kategoriFiltre = document.getElementById("kategoriFiltre");
const tarihFiltre = document.getElementById("tarihFiltre");
const butceInput = document.getElementById("butceInput");
const butceKaydetBtn = document.getElementById("butceKaydetBtn");
const butceDurum = document.getElementById("butceDurum");
const gelirForm = document.getElementById("gelirForm");
const gelirListesi = document.getElementById("gelirListesi");
const bildirimKutusu = document.getElementById("bildirimKutusu");
const sonIslemlerListesi = document.getElementById("sonIslemlerListesi");
const temaDegistirBtn = document.getElementById("temaDegistirBtn");
const verileriTemizleBtn = document.getElementById("verileriTemizleBtn");
const kullaniciAdiInput = document.getElementById("kullaniciAdiInput");
const kullaniciAdiBtn = document.getElementById("kullaniciAdiBtn");
const karsilamaMesaji = document.getElementById("karsilamaMesaji");

let butceLimiti = Number(localStorage.getItem("butceLimiti")) || 0;
let duzenlenenId = null;

async function harcamalariGetir() {
    const response = await fetch("http://localhost:3000/harcamalar");
    const data = await response.json();

    harcamaListesi.innerHTML = "";

    let toplam = 0;

    data
.filter(harcama => {

    const aramaUygun =
        harcama.baslik
            .toLowerCase()
            .includes(aramaInput.value.toLowerCase());

    const kategoriUygun =
    kategoriFiltre.value === "" ||
    harcama.kategori === kategoriFiltre.value;

const tarihUygun =
    tarihFiltre.value === "" ||
    harcama.tarih === tarihFiltre.value;

return aramaUygun && kategoriUygun && tarihUygun;

})
.forEach(harcama => {
        toplam += Number(harcama.miktar);

        harcamaListesi.innerHTML += `
            <div class="harcama-kart">
                <h3>${harcama.baslik}</h3>
                <p><strong>Miktar:</strong> ${harcama.miktar} ₺</p>
                <p><strong>Kategori:</strong> ${harcama.kategori}</p>
                <p><strong>Tarih:</strong> ${harcama.tarih}</p>
                <p>${harcama.aciklama || ""}</p>

                <button onclick="harcamaSil(${harcama.id})">Sil</button>

                <button class="guncelle-btn"
                    onclick="harcamaDuzenle(${harcama.id}, '${harcama.baslik}', ${harcama.miktar}, '${harcama.kategori}', '${harcama.tarih}', '${harcama.aciklama || ""}')">
                    Güncelle
                </button>
            </div>
        `;
    });

    document.getElementById("toplamHarcama").innerText = toplam + " ₺";
    butceDurumuGuncelle(toplam);
    gelirleriGetir();
    sonIslemleriGetir();
    aylikRaporlariGetir();
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const baslik = document.getElementById("baslik").value.trim();
const miktar = Number(document.getElementById("miktar").value);
const kategori = document.getElementById("kategori").value;
const tarih = document.getElementById("tarih").value;

if (!baslik || miktar <= 0 || !kategori || !tarih) {
    alert("Lütfen tüm zorunlu alanları doğru şekilde doldurunuz.");
    return;
}

const bugun = new Date().toISOString().split("T")[0];

if (tarih > bugun) {
    bildirimGoster("Gelecek tarihli harcama girilemez.");
    return;
}

   const harcama = {
    baslik: baslik,
    miktar: miktar,
    kategori: kategori,
    tarih: tarih,
    aciklama: document.getElementById("aciklama").value.trim()
};

    let url = "http://localhost:3000/harcamalar";
    let method = "POST";

    if (duzenlenenId) {
        url = `http://localhost:3000/harcamalar/${duzenlenenId}`;
        method = "PUT";
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(harcama)
    });

    const data = await response.json();

    bildirimGoster(data.message || data.error);
    form.reset();
    duzenlenenId = null;

    document.querySelector("#harcamaForm button").innerText = "Harcama Ekle";

    harcamalariGetir();
    sonIslemleriGetir();
    aylikRaporlariGetir();
});

async function harcamaSil(id) {
    const response = await fetch(`http://localhost:3000/harcamalar/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    bildirimGoster(data.message);

    harcamalariGetir();
    aylikRaporlariGetir();
}

function harcamaDuzenle(id, baslik, miktar, kategori, tarih, aciklama) {
    document.getElementById("baslik").value = baslik;
    document.getElementById("miktar").value = miktar;
    document.getElementById("kategori").value = kategori;
    document.getElementById("tarih").value = tarih;
    document.getElementById("aciklama").value = aciklama;

    duzenlenenId = id;

    document.querySelector("#harcamaForm button").innerText = "Harcama Güncelle";
}

harcamalariGetir();

aramaInput.addEventListener("input", () => {
    harcamalariGetir();
});

kategoriFiltre.addEventListener("change", () => {
    harcamalariGetir();
});

tarihFiltre.addEventListener("change", () => {
    harcamalariGetir();
});

function butceDurumuGuncelle(toplam) {
    if (butceLimiti <= 0) {
        butceDurum.innerText = "Henüz bütçe girilmedi.";
        return;
    }

    const kalan = butceLimiti - toplam;

    if (kalan >= 0) {
        butceDurum.innerText =
            `Bütçe: ${butceLimiti} ₺ | Kalan: ${kalan} ₺ | Durum: Bütçe içinde`;
    } else {
        butceDurum.innerText =
            `Bütçe: ${butceLimiti} ₺ | Aşılan Tutar: ${Math.abs(kalan)} ₺ | Durum: Bütçe aşıldı!`;
    }
}

butceKaydetBtn.addEventListener("click", () => {
    butceLimiti = Number(butceInput.value);

    if (butceLimiti <= 0) {
        bildirimGoster("Lütfen geçerli bir bütçe limiti giriniz.");
        return;
    }

    localStorage.setItem("butceLimiti", butceLimiti);

   bildirimGoster("Bütçe limiti kaydedildi.");

    harcamalariGetir();
});

gelirForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const gelirMiktar = Number(document.getElementById("gelirMiktar").value);
const gelirTarih = document.getElementById("gelirTarih").value;

if (gelirMiktar <= 0 || !gelirTarih) {
    bildirimGoster("Lütfen geçerli bir gelir miktarı ve tarih giriniz.");
    return;
}

const bugunGelir = new Date().toISOString().split("T")[0];

if (gelirTarih > bugunGelir) {
   bildirimGoster("Gelecek tarihli gelir girilemez.");
    return;
}

  const gelir = {
    miktar: gelirMiktar,
    tarih: gelirTarih
};

    const response = await fetch("http://localhost:3000/gelirler", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(gelir)
    });

    const data = await response.json();

    bildirimGoster(data.message || data.error);

    gelirForm.reset();
gelirleriGetir();
harcamalariGetir();
sonIslemleriGetir();
aylikRaporlariGetir();

});
async function gelirleriGetir() {

    const response = await fetch("http://localhost:3000/gelirler");

    const data = await response.json();

    let toplamGelir = 0;
    gelirListesi.innerHTML = "";

   data.forEach(gelir => {
    toplamGelir += Number(gelir.miktar);

    gelirListesi.innerHTML += `
    <div class="gelir-kart">
        <h3>${gelir.miktar} ₺</h3>
        <p><strong>Tarih:</strong> ${gelir.tarih}</p>

        <button onclick="gelirSil(${gelir.id})">
            Sil
        </button>
    </div>
`;
});

    document.getElementById("toplamGelir").innerText =
        toplamGelir + " ₺";

    const toplamHarcama =
        Number(
            document
                .getElementById("toplamHarcama")
                .innerText
                .replace("₺", "")
        );

    const kalanBakiye = toplamGelir - toplamHarcama;

    document.getElementById("kalanBakiye").innerText =
        kalanBakiye + " ₺";

}

gelirleriGetir();

async function gelirSil(id) {
    const response = await fetch(`http://localhost:3000/gelirler/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    bildirimGoster(data.message || data.error);

    gelirleriGetir();
    harcamalariGetir();
    sonIslemleriGetir();
    aylikRaporlariGetir();

}

function bildirimGoster(mesaj) {

    bildirimKutusu.innerText = mesaj;

    bildirimKutusu.classList.add("goster");

    setTimeout(() => {
        bildirimKutusu.classList.remove("goster");
    }, 2500);

}

function sekmeGoster(sekmeId) {

    const sekmeler = document.querySelectorAll(".sekme");

    sekmeler.forEach(sekme => {
        sekme.classList.remove("aktif-sekme");
    });

    document
        .getElementById(sekmeId)
        .classList.add("aktif-sekme");

    const butonlar = document.querySelectorAll(".menu-btn");

    butonlar.forEach(btn => {
        btn.classList.remove("aktif");
    });

    event.target.classList.add("aktif");

}
async function sonIslemleriGetir() {
    const harcamaResponse = await fetch("http://localhost:3000/harcamalar");
    const gelirResponse = await fetch("http://localhost:3000/gelirler");

    const harcamalar = await harcamaResponse.json();
    const gelirler = await gelirResponse.json();

    const islemler = [
        ...harcamalar.map(harcama => ({
            tip: "harcama",
            baslik: harcama.baslik,
            miktar: harcama.miktar,
            tarih: harcama.tarih,
            kategori: harcama.kategori
        })),

        ...gelirler.map(gelir => ({
            tip: "gelir",
            baslik: "Gelir",
            miktar: gelir.miktar,
            tarih: gelir.tarih,
            kategori: "Gelir"
        }))
    ];

    islemler.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

    sonIslemlerListesi.innerHTML = "";

    islemler.forEach(islem => {
        const isGelir = islem.tip === "gelir";

        sonIslemlerListesi.innerHTML += `
            <div class="islem-kart ${isGelir ? "gelir-islem" : "harcama-islem"}">
                <h3>${isGelir ? "+" : "-"}${islem.miktar} ₺</h3>
                <p><strong>İşlem:</strong> ${islem.baslik}</p>
                <p><strong>Kategori:</strong> ${islem.kategori}</p>
                <p><strong>Tarih:</strong> ${islem.tarih}</p>
            </div>
        `;
    });
}

sonIslemleriGetir();

temaDegistirBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("tema", "dark");
        bildirimGoster("Koyu tema açıldı.");
    } else {
        localStorage.setItem("tema", "light");
        bildirimGoster("Açık tema açıldı.");
    }
});

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
}

verileriTemizleBtn.addEventListener("click", async () => {
    const onay = confirm("Tüm gelir, harcama ve bütçe verileri silinsin mi?");

    if (!onay) {
        return;
    }

    const response = await fetch("http://localhost:3000/veriler", {
        method: "DELETE"
    });

    const data = await response.json();

    localStorage.removeItem("butceLimiti");
    butceLimiti = 0;

    bildirimGoster(data.message || data.error);

    harcamalariGetir();
    gelirleriGetir();
    sonIslemleriGetir();

    document.getElementById("butceDurum").innerText = "Henüz bütçe girilmedi.";
    document.getElementById("butceDurumButce").innerText = "Henüz bütçe girilmedi.";
});

async function aylikRaporlariGetir() {

    const harcamaResponse = await fetch("http://localhost:3000/harcamalar");
    const gelirResponse = await fetch("http://localhost:3000/gelirler");

    const harcamalar = await harcamaResponse.json();
    const gelirler = await gelirResponse.json();

    const bugun = new Date();

    const ay = bugun.getMonth() + 1;
    const yil = bugun.getFullYear();

    let aylikGelir = 0;
    let aylikHarcama = 0;

    const kategoriToplamlari = {};

    harcamalar.forEach(harcama => {

        const tarih = new Date(harcama.tarih);

        const harcamaAy = tarih.getMonth() + 1;
        const harcamaYil = tarih.getFullYear();

        if (harcamaAy === ay && harcamaYil === yil) {

            aylikHarcama += Number(harcama.miktar);

            if (!kategoriToplamlari[harcama.kategori]) {
                kategoriToplamlari[harcama.kategori] = 0;
            }

            kategoriToplamlari[harcama.kategori] += Number(harcama.miktar);
        }

    });

    gelirler.forEach(gelir => {

        const tarih = new Date(gelir.tarih);

        const gelirAy = tarih.getMonth() + 1;
        const gelirYil = tarih.getFullYear();

        if (gelirAy === ay && gelirYil === yil) {
            aylikGelir += Number(gelir.miktar);
        }

    });

    document.getElementById("aylikGelir").innerText =
        aylikGelir + " ₺";

    document.getElementById("aylikHarcama").innerText =
        aylikHarcama + " ₺";

    document.getElementById("aylikBakiye").innerText =
        (aylikGelir - aylikHarcama) + " ₺";

    let enCokKategori = "Veri bulunamadı.";
    let enYuksek = 0;

    for (const kategori in kategoriToplamlari) {

        if (kategoriToplamlari[kategori] > enYuksek) {
            enYuksek = kategoriToplamlari[kategori];
            enCokKategori = kategori;
        }

    }

    document.getElementById("enCokKategori").innerText =
        enCokKategori;

}
aylikRaporlariGetir();

let kullaniciAdi =
    localStorage.getItem("kullaniciAdi") || "Rewa";

karsilamaMesaji.innerText =
    `Merhaba, ${kullaniciAdi} 👋`;

kullaniciAdiBtn.addEventListener("click", () => {

    const yeniAd = kullaniciAdiInput.value.trim();

    if (!yeniAd) {
        bildirimGoster("Lütfen geçerli bir kullanıcı adı giriniz.");
        return;
    }

    localStorage.setItem("kullaniciAdi", yeniAd);

    karsilamaMesaji.innerText =
        `Merhaba, ${yeniAd} 👋`;

    bildirimGoster("Kullanıcı adı güncellendi.");

    kullaniciAdiInput.value = "";

});