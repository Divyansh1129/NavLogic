import express from "express";
import { findRoute } from "../controllers/routeController.js";

const router = express.Router();

router.post("/find", findRoute);


export default router;