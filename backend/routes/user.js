const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'kategorije'
});

/**
 * @swagger
 * tags:
 *   name: Proizvodi
 *   description: API za upravljanje proizvodima i kategorijama
 */

/**
 * @swagger
 * /api/proizvodi/kategorije:
 *   get:
 *     summary: Dohvati sve kategorije
 *     tags: [Proizvodi]
 *     responses:
 *       200:
 *         description: Lista kategorija
 */
router.get('/kategorije', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, naziv FROM kategorije');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška kod dohvaćanja kategorija' });
  }
});

/**
 * @swagger
 * /api/proizvodi:
 *   get:
 *     summary: Dohvati sve proizvode (moguće filtriranje po kategoriji i pretrazi)
 *     tags: [Proizvodi]
 *     parameters:
 *       - in: query
 *         name: kategorija
 *         schema:
 *           type: integer
 *         description: ID kategorije
 *       - in: query
 *         name: pretraga
 *         schema:
 *           type: string
 *         description: Dio naziva proizvoda za pretragu
 *     responses:
 *       200:
 *         description: Lista proizvoda
 */
router.get('/', async (req, res) => {
  const { pretraga, kategorija } = req.query;

  let query = `
    SELECT p.id, p.naziv, p.sastojci, p.uputa, p.slikaUrl, k.naziv AS kategorija
    FROM proizvodi p
    JOIN kategorije k ON p.kategorija_id = k.id
  `;

  const queryParams = [];

  if (kategorija) {
    query += ' WHERE k.id = ?';
    queryParams.push(kategorija);
  }

  if (pretraga) {
    query += queryParams.length > 0 ? ' AND p.naziv LIKE ?' : ' WHERE p.naziv LIKE ?';
    queryParams.push(`%${pretraga}%`);
  }

  try {
    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška kod dohvaćanja proizvoda' });
  }
});

/**
 * @swagger
 * /api/proizvodi/{id}:
 *   get:
 *     summary: Dohvati jedan proizvod po ID-u
 *     tags: [Proizvodi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Podaci o proizvodu
 *       404:
 *         description: Proizvod nije pronađen
 */
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Neispravan ID proizvoda' });

  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.naziv, p.sastojci, p.uputa, p.slikaUrl, k.naziv AS kategorija
      FROM proizvodi p
      JOIN kategorije k ON p.kategorija_id = k.id
      WHERE p.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Proizvod nije pronađen' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška kod dohvaćanja proizvoda' });
  }
});

/**
 * @swagger
 * /api/proizvodi:
 *   post:
 *     summary: Dodaj novi proizvod
 *     tags: [Proizvodi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naziv:
 *                 type: string
 *               sastojci:
 *                 type: string
 *               uputa:
 *                 type: string
 *               kategorija_id:
 *                 type: integer
 *               slikaUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proizvod uspješno dodan
 */
router.post('/', async (req, res) => {
  const { naziv, sastojci, uputa, kategorija_id, slikaUrl } = req.body;

  if (!naziv || !sastojci || !uputa || !kategorija_id) {
    return res.status(400).json({ error: 'Sva polja su obavezna: naziv, sastojci, uputa, kategorija_id' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO proizvodi (naziv, sastojci, uputa, kategorija_id, slikaUrl)
      VALUES (?, ?, ?, ?, ?)
    `, [naziv, sastojci, uputa, kategorija_id, slikaUrl || null]);

    res.status(201).json({ message: 'Proizvod uspješno dodan', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dodavanja proizvoda' });
  }
});

/**
 * @swagger
 * /api/proizvodi/{id}:
 *   put:
 *     summary: Ažuriraj postojeći proizvod
 *     tags: [Proizvodi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naziv:
 *                 type: string
 *               sastojci:
 *                 type: string
 *               uputa:
 *                 type: string
 *               kategorija_id:
 *                 type: integer
 *               slikaUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proizvod uspješno ažuriran
 *       404:
 *         description: Proizvod nije pronađen
 */
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { naziv, sastojci, uputa, kategorija_id, slikaUrl } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'Neispravan ID proizvoda' });
  if (!naziv || !sastojci || !uputa || !kategorija_id) {
    return res.status(400).json({ error: 'Sva polja su obavezna: naziv, sastojci, uputa, kategorija_id' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE proizvodi
      SET naziv = ?, sastojci = ?, uputa = ?, kategorija_id = ?, slikaUrl = ?
      WHERE id = ?
    `, [naziv, sastojci, uputa, kategorija_id, slikaUrl || null, id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Proizvod nije pronađen' });

    res.json({ message: 'Proizvod uspješno ažuriran' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom ažuriranja proizvoda' });
  }
});

/**
 * @swagger
 * /api/proizvodi/{id}:
 *   delete:
 *     summary: Obriši proizvod po ID-u
 *     tags: [Proizvodi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proizvod uspješno obrisan
 *       404:
 *         description: Proizvod nije pronađen
 */
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Neispravan ID proizvoda' });

  try {
    const [result] = await pool.query(`DELETE FROM proizvodi WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Proizvod nije pronađen' });

    res.json({ message: 'Proizvod uspješno obrisan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom brisanja proizvoda' });
  }
});

module.exports = router;
