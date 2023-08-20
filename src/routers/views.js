import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
    res.render('login', {
        title: 'Iniciar sesión'
    })
});

router.get("/chat", (req, res) => {
    res.render('chat', {
        title: 'Sala de chat'
    })
});

export default router;