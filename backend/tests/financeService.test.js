const {
    toplamHesapla,
    kalanBakiyeHesapla,
    butceDurumuHesapla,
    gecerliMiktarMi,
    gecerliBaslikMi,
    gelecekTarihMi
} = require("../services/financeService");

test("Toplam harcama doğru hesaplanmalı", () => {

    const liste = [
        { miktar: 100 },
        { miktar: 200 },
        { miktar: 300 }
    ];

    expect(toplamHesapla(liste)).toBe(600);

});

test("Kalan bakiye doğru hesaplanmalı", () => {

    expect(
        kalanBakiyeHesapla(5000, 2000)
    ).toBe(3000);

});

test("Bütçe durumu doğru dönmeli", () => {

    expect(
        butceDurumuHesapla(5000, 3000)
    ).toBe("Bütçe içinde");

    expect(
        butceDurumuHesapla(2000, 4000)
    ).toBe("Bütçe aşıldı");

});

test("Negatif miktar geçersiz olmalı", () => {

    expect(
        gecerliMiktarMi(-50)
    ).toBe(false);

});

test("Pozitif miktar geçerli olmalı", () => {

    expect(
        gecerliMiktarMi(150)
    ).toBe(true);

});

test("Boş başlık geçersiz olmalı", () => {
    expect(gecerliBaslikMi("")).toBe(false);
});

test("Dolu başlık geçerli olmalı", () => {
    expect(gecerliBaslikMi("Maaş")).toBe(true);
});

test("Gelecek tarih geçersiz olmalı", () => {
    expect(gelecekTarihMi("2099-01-01")).toBe(true);
});