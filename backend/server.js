const express = require("express");
const cors = require("cors");
const db = require("./database");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();
const PORT = 3000;
const SECRET_KEY = "butceappsecretkey";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

app.post("/harcamalar", tokenKontrol, (req, res) => {
    const { baslik, miktar, kategori, tarih, aciklama } = req.body;

    if (!baslik || !miktar || !kategori || !tarih) {
        return res.status(400).json({
            error: "Zorunlu alanlar eksik."
        });
    }

    const sql = `
       INSERT INTO harcamalar 
(user_id, baslik, miktar, kategori, tarih, aciklama)
VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql,[req.user.id, baslik, miktar, kategori, tarih, aciklama], function (err) {
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

app.get("/harcamalar", tokenKontrol, (req, res) => {

    const sql = `
        SELECT * FROM harcamalar
WHERE user_id = ?
ORDER BY id DESC
    `;

    db.all(sql, [req.user.id], (err, rows) => {

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

app.delete("/harcamalar/:id", tokenKontrol, (req, res) => {

    const id = req.params.id;

    const sql = `
       DELETE FROM harcamalar
WHERE id = ? AND user_id = ?
    `;

    db.run(sql,[id, req.user.id], function (err) {

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

app.put("/harcamalar/:id", tokenKontrol, (req, res) => {
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
WHERE id = ? AND user_id = ?
    `;

    db.run(sql, [baslik, miktar, kategori, tarih, aciklama, id, req.user.id], function (err) {
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

app.post("/gelirler", tokenKontrol, (req, res) => {
    const { baslik, miktar, tarih } = req.body;

    if (!miktar || !tarih) {
        return res.status(400).json({
            error: "Miktar ve tarih zorunludur."
        });
    }

   const sql = `
    INSERT INTO gelirler 
    (user_id, baslik, miktar, tarih)
    VALUES (?, ?, ?, ?)
`;

   db.run(sql, [req.user.id, baslik, miktar, tarih], function (err) {
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

app.get("/gelirler", tokenKontrol, (req, res) => {
    const sql = `
        SELECT * FROM gelirler
WHERE user_id = ?
ORDER BY id DESC
    `;

    db.all(sql, [req.user.id], (err, rows) => {
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

app.delete("/gelirler/:id", tokenKontrol, (req, res) => {
    const id = req.params.id;

    const sql = `
       DELETE FROM gelirler
WHERE id = ? AND user_id = ?
    `;

    db.run(sql, [id, req.user.id], function (err) {
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

app.delete("/veriler", tokenKontrol, (req, res) => {
    db.serialize(() => {
        db.run("DELETE FROM harcamalar WHERE user_id = ?", [req.user.id]);
db.run("DELETE FROM gelirler WHERE user_id = ?", [req.user.id], (err) => {
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

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Kullanıcı adı ve şifre zorunludur."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO users (username, password)
         VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: "Kullanıcı oluşturulamadı."
                });
            }

            res.status(201).json({
                message: "Kullanıcı başarıyla oluşturuldu."
            });

        }
    );

});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        async (err, user) => {

            if (err || !user) {
                return res.status(401).json({
                    error: "Kullanıcı bulunamadı."
                });
            }

            const sifreDogruMu =
                await bcrypt.compare(password, user.password);

            if (!sifreDogruMu) {
                return res.status(401).json({
                    error: "Şifre yanlış."
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username
                },
                SECRET_KEY,
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                message: "Giriş başarılı.",
                token: token
            });

        }
    );

});

function tokenKontrol(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            error: "Token bulunamadı."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Geçersiz token."
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: "Token geçersiz veya süresi dolmuş."
            });
        }

        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});