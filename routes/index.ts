import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
    res.render("csh", { id: undefined });
});

router.get("/:id", (req, res, next) => {
    res.render("csh", { id: req.params.id });
});

export default router;