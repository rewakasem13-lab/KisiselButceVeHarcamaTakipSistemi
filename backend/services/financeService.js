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

module.exports = {
    toplamHesapla,
    kalanBakiyeHesapla,
    butceDurumuHesapla,
    gecerliMiktarMi
};