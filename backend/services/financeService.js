function toplamHesapla(liste) {
    return liste.reduce((toplam, item) => {
        return toplam + Number(item.miktar);
    }, 0);
}

function kalanBakiyeHesapla(toplamGelir, toplamHarcama) {
    return Number(toplamGelir) - Number(toplamHarcama);
}

function butceDurumuHesapla(butceLimiti, toplamHarcama) {
    const kalan = Number(butceLimiti) - Number(toplamHarcama);

    if (kalan >= 0) {
        return "Bütçe içinde";
    }

    return "Bütçe aşıldı";
}

function gecerliMiktarMi(miktar) {
    return Number(miktar) > 0;
}


function gecerliBaslikMi(baslik) {
    return typeof baslik === "string" && baslik.trim().length > 0;
}

function gelecekTarihMi(tarih) {
    const bugun = new Date().toISOString().split("T")[0];
    return tarih > bugun;
}

module.exports = {
    toplamHesapla,
    kalanBakiyeHesapla,
    butceDurumuHesapla,
    gecerliMiktarMi,
    gecerliBaslikMi,
    gelecekTarihMi
};

