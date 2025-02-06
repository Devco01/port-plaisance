const express = require("express");
const router = express.Router();
const { login, logout, getCurrentUser, changePassword } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Routes publiques
router.post("/login", login);
router.post("/logout", logout);

// Routes protégées
router.get("/me", auth, getCurrentUser);
router.post("/change-password", auth, changePassword);
router.get("/check", auth, (req, res) => {
    res.json({
        success: true,
        message: "Authentifié",
        user: req.user
    });
});

module.exports = router;
