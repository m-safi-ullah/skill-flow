import express from "express";
const router = express.Router();
import { getProducts } from "../Controllers/searchproducts.js";

router.get("/getProducts", getProducts);

export default router;
