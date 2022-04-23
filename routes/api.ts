import { randomBytes } from "crypto";
import express from "express";
import cshStorage from "../assets/CshStorage";

const router = express.Router();
const storage = cshStorage();

router.post("/share", async (req, res, next) => {
    const token = req.cookies["ShrToken"] || randomBytes(32).toString("base64");
    const id = req.body.id || "";
    
    try {
        let data = await storage.get(id);

        if (data && data.token === token) {
            if (data.bigId !== req.body.bigId) {
                await storage.del(id);
                data = await storage.add({ ...req.body, token: token });
            }
            else {
                data = await storage.edit({ ...req.body, token: token }) || await storage.add({ ...req.body, token: token });
            }
        }
        else if (!data) {
            data = await storage.add({ ...req.body, token: token });
        }
        else {
            res.sendStatus(400);
            return;
        }
        
        res.cookie("ShrToken", token).json({ id: data.id });
    } catch {
        res.sendStatus(500);
    }
});

router.get("/share", async (req, res, next) => {
    try {
        const id = req.query.id?.toString();

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const data = await storage.get(id);

        if (!data) {
            res.sendStatus(404);
            return;
        }

        if (Date.now() - new Date(data.date).valueOf() > 259200000) {
            await storage.del(data.id);
            res.sendStatus(404);
            return;
        }

        res.json(storage.safe(data));
    } catch {
        res.sendStatus(500);
    }
});

export default router;
