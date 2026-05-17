const express = require("express");
const cors = require("cors");
const db = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Kişisel Bütçe ve Harcama Takip Sistemi API",
            version: "1.0.0",
            description: "Sistem Analizi ve Tasarımı dersi CRUD projesi API dokümantasyonu"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "Kişisel Bütçe ve Harcama Takip Sistemi API çalışıyor." });
});

/**
 * @swagger
 * /harcamalar:
 *   post:
 *     summary: Yeni harcama ekler
 *     tags:
 *       - Harcamalar
 *     responses:
 *       201:
 *         description: Harcama başarıyla eklendi
 */

app.post("/harcamalar", (req, res) => {
    const { baslik, miktar, kategori, tarih, aciklama } = req.body;

    if (!baslik || !miktar || !kategori || !tarih) {
        return res.status(400).json({
            error: "Zorunlu alanlar eksik."
        });
    }

    const sql = `
        INSERT INTO harcamalar 
        (baslik, miktar, kategori, tarih, aciklama)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [baslik, miktar, kategori, tarih, aciklama], function (err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Harcama eklendi.",
            id: this.lastID
        });
    });
});

/**
 * @swagger
 * /harcamalar:
 *   get:
 *     summary: Tüm harcamaları getirir
 *     tags:
 *       - Harcamalar
 *     responses:
 *       200:
 *         description: Harcama listesi başarıyla getirildi
 */

app.get("/harcamalar", (req, res) => {

    const sql = `
        SELECT * FROM harcamalar
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });

});

/**
 * @swagger
 * /harcamalar/{id}:
 *   delete:
 *     summary: Harcamayı siler
 *     tags:
 *       - Harcamalar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Harcama başarıyla silindi
 */

app.delete("/harcamalar/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM harcamalar
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Harcama silindi."
        });

    });

});

app.put("/harcamalar/:id", (req, res) => {
    const id = req.params.id;
    const { baslik, miktar, kategori, tarih, aciklama } = req.body;

    if (!baslik || !miktar || !kategori || !tarih) {
        return res.status(400).json({
            error: "Zorunlu alanlar eksik."
        });
    }

    const sql = `
        UPDATE harcamalar
        SET baslik = ?, miktar = ?, kategori = ?, tarih = ?, aciklama = ?
        WHERE id = ?
    `;

    db.run(sql, [baslik, miktar, kategori, tarih, aciklama, id], function (err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Harcama güncellendi."
        });
    });
});

/**
 * @swagger
 * /gelirler:
 *   post:
 *     summary: Yeni gelir ekler
 *     tags:
 *       - Gelirler
 *     responses:
 *       201:
 *         description: Gelir başarıyla eklendi
 */

app.post("/gelirler", (req, res) => {
    const { miktar, tarih } = req.body;

    if (!miktar || !tarih) {
        return res.status(400).json({
            error: "Miktar ve tarih zorunludur."
        });
    }

    const sql = `
        INSERT INTO gelirler 
        (miktar, tarih)
        VALUES (?, ?)
    `;

    db.run(sql, [miktar, tarih], function (err) {
        if (err) {
            console.log("Gelir ekleme hatası:", err.message);
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Gelir eklendi.",
            id: this.lastID
        });
    });
});

/**
 * @swagger
 * /gelirler:
 *   get:
 *     summary: Tüm gelirleri getirir
 *     tags:
 *       - Gelirler
 *     responses:
 *       200:
 *         description: Gelir listesi başarıyla getirildi
 */

app.get("/gelirler", (req, res) => {
    const sql = `
        SELECT * FROM gelirler
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

/**
 * @swagger
 * /gelirler/{id}:
 *   delete:
 *     summary: Geliri siler
 *     tags:
 *       - Gelirler
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gelir başarıyla silindi
 */

app.delete("/gelirler/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        DELETE FROM gelirler
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Gelir silindi."
        });
    });
});

app.delete("/veriler", (req, res) => {
    db.serialize(() => {
        db.run("DELETE FROM harcamalar");
        db.run("DELETE FROM gelirler", (err) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Tüm veriler temizlendi."
            });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});