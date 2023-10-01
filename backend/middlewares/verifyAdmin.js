const { User } = require('../models');

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId); // assumindo que o userId está no request após a autenticação

        if (!user) {
            return res.status(403).json({ message: "Acesso negado." });
        }

        if (!user.is_adm) {
            return res.status(403).json({ message: "Requer privilégios de administrador." });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "Erro ao verificar direitos de administrador.", error: err.message });
    }
}

module.exports = verifyAdmin;
