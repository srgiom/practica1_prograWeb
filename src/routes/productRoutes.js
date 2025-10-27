// src/routes/productRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";
import { authenticateJWT, authorizeRole } from "../middleware/authenticateJWT.js";

const router = Router();

const uploadDir = "src/public/uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET /api/products
router.get("/", async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ ok: false, error: "No encontrado" });
  res.json(p);
});

// POST /api/products  (admin)
router.post(
  "/",
  authenticateJWT,
  authorizeRole("admin"),
  upload.single("imagen"),                            // <-- el nombre del campo debe ser 'imagen'
  async (req, res) => {
    try {
      const { nombre, precio, descripcion } = req.body;
      if (!nombre) return res.status(400).json({ ok: false, error: "Nombre requerido" });

      const p = await Product.create({
        nombre,
        precio: parseFloat(precio),
        descripcion,
        imagen: req.file ? "/uploads/" + req.file.filename : null
      });

      res.status(201).json(p);
    } catch (e) {
      res.status(400).json({ ok: false, error: "Datos inválidos" });
    }
  }
);

// PUT /api/products/:id  (admin)
router.put(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  upload.single("imagen"),                            // <-- mismo nombre
  async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.file) body.imagen = "/uploads/" + req.file.filename;

      const p = await Product.findByIdAndUpdate(
        req.params.id,
        body,
        { new: true, runValidators: true }
      );

      if (!p) return res.status(404).json({ ok: false, error: "No encontrado" });
      res.json(p);
    } catch (e) {
      res.status(400).json({ ok: false, error: "Datos inválidos" });
    }
  }
);

// DELETE /api/products/:id  (admin)
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRole("admin"),
  async (req, res) => {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ ok: false, error: "No encontrado" });
    res.json({ ok: true });
  }
);

export default router;