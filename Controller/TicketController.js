const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SK);
const Ticket = require('../DB/Models/Ticket');
const app = express.Router();

app.use(express.json());

exports.booking = async (req, res) => {
  try {
    const { userId, email, price, filmId, quantite } = req.body;

    if (!userId || !email || !price || !filmId || !quantite) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, 
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { userId, email, filmId, quantite },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "No Client Secret is sent", success: false });
    }

    const newTicket = new Ticket({
      userId,
      email,
      filmId,
      quantite,
      price,
      statusPayment: "success",
    });

    await newTicket.save();

    res.status(200).json({
      message: "Ticket is booked successfully.",
      clientSecret: paymentIntent.client_secret,
      ticketId: newTicket._id,
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to create ticket", success: false });
  }
};



exports.allTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID manquant" });
    }


    const tickets = await Ticket.find({ userId });

   

    return res.status(200).json({ success: true, data: tickets });

  } catch (error) {
    console.error("Erreur lors de la récupération des billets :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

