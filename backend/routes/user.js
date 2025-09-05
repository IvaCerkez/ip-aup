const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API za korisnike
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Dohvati listu korisnika
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista korisnika
 */
router.get('/', (req, res) => {
  // Ovdje bi inače dohvat korisnika iz baze
  res.json([
    { id: 1, ime: 'Ivan', email: 'ivan@example.com' },
    { id: 2, ime: 'Ana', email: 'ana@example.com' }
  ]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Dohvati korisnika po ID-u
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID korisnika
 *     responses:
 *       200:
 *         description: Podaci korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 ime:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Korisnik nije pronađen
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Neispravan ID korisnika' });
  }

  const korisnici = [
    { id: 1, ime: 'Ivan', email: 'ivan@example.com' },
    { id: 2, ime: 'Ana', email: 'ana@example.com' }
  ];

  const korisnik = korisnici.find(k => k.id === id);
  if (!korisnik) {
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
  }
  res.json(korisnik);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Dodaj novog korisnika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ime:
 *                 type: string
 *               email:
 *                 type: string
 *               lozinka:
 *                 type: string
 *             required:
 *               - ime
 *               - email
 *               - lozinka
 *     responses:
 *       201:
 *         description: Korisnik uspješno dodan
 *       400:
 *         description: Nedostaju obavezna polja
 */
router.post('/', (req, res) => {
  const { ime, email, lozinka } = req.body;
  if (!ime || !email || !lozinka) {
    return res.status(400).json({ error: 'Sva polja su obavezna: ime, email, lozinka' });
  }
  // Ovdje bi se korisnik dodao u bazu (dummy response)
  res.status(201).json({ message: 'Korisnik uspješno dodan', korisnik: { ime, email } });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Ažuriraj korisnika po ID-u
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID korisnika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ime:
 *                 type: string
 *               email:
 *                 type: string
 *               lozinka:
 *                 type: string
 *             required:
 *               - ime
 *               - email
 *               - lozinka
 *     responses:
 *       200:
 *         description: Korisnik uspješno ažuriran
 *       400:
 *         description: Neispravan ID ili nedostaju obavezna polja
 *       404:
 *         description: Korisnik nije pronađen
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { ime, email, lozinka } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Neispravan ID korisnika' });
  }
  if (!ime || !email || !lozinka) {
    return res.status(400).json({ error: 'Sva polja su obavezna: ime, email, lozinka' });
  }

  // Dummy provjera postoji li korisnik (primjer)
  const korisnici = [1, 2]; 
  if (!korisnici.includes(id)) {
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
  }

  // Ovdje bi se korisnik ažurirao u bazi
  res.json({ message: 'Korisnik uspješno ažuriran' });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Obriši korisnika po ID-u
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID korisnika
 *     responses:
 *       200:
 *         description: Korisnik uspješno obrisan
 *       400:
 *         description: Neispravan ID
 *       404:
 *         description: Korisnik nije pronađen
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Neispravan ID korisnika' });
  }

  // Dummy provjera postoji li korisnik (primjer)
  const korisnici = [1, 2];
  if (!korisnici.includes(id)) {
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
  }

  // Ovdje bi se korisnik obrisao iz baze
  res.json({ message: 'Korisnik uspješno obrisan' });
});

module.exports = router;
