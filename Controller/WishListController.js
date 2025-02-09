const WishList = require('../DB/Models/WishList');
const mongoose = require('mongoose');

exports.createList = async (req, res) => {
    try {
        const { userId, filmId } = req.body;

        if (!userId || !filmId) {
            return res.status(400).json({ message: "User ID and Film ID are required", success: false });
        }

        // Vérifie si l'utilisateur a déjà une wishlist
        let wishlist = await WishList.findOne({ userId });

        if (!wishlist) {
            wishlist = new WishList({ userId, films: [filmId] });
        } else {

            // Vérifie si le film est déjà dans la liste
            if (wishlist.films.includes(filmId)) {
                return res.status(409).json({ message: "Film already in wishlist", success: false });
            }
            wishlist.films.push(filmId);
        }

        await wishlist.save();

        return res.status(200).json({
            message: "Film added to wishlist",
            success: true,
            data: wishlist
        });

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};



exports.removeFromList = async (req, res) => {
    try {
        let { userId, filmId } = req.body;

        if (!userId || !filmId) {
            return res.status(400).json({ message: "User ID and Film ID are required", success: false });
        }

        // Vérifier si userId est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID", success: false });
        }

        userId = new mongoose.Types.ObjectId(userId); // Convertir en ObjectId

        // Trouver la wishlist de l'utilisateur
        let wishlist = await WishList.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found", success: false });
        }

        // Vérifier si le film est dans la liste
        const filmIndex = wishlist.films.indexOf(filmId);
        if (filmIndex === -1) {
            return res.status(400).json({ message: "Film not found in wishlist", success: false });
        }

        // Supprimer le film du tableau
        wishlist.films.splice(filmIndex, 1);

        // Sauvegarder la mise à jour
        await wishlist.save();

        return res.status(200).json({
            message: "Film removed from wishlist",
            success: true,
            data: wishlist
        });

    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


exports.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Récupérer l'ID utilisateur depuis l'URL
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID manquant" });
        }

        const wishlists = await WishList.find({ userId });

        if (!wishlists || wishlists.length === 0) {
            return res.status(404).json({ success: false, message: "Aucune wishlist trouvée pour cet utilisateur" });
        }

        return res.status(200).json({ success: true, data: wishlists });
    } catch (error) {
        console.error("Erreur lors de la récupération des wishlists :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};