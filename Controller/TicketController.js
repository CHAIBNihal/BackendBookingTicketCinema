const express = require('express');
const Ticket = require('../DB/Models/Ticket');
const app = express.Router();

app.use(express.json())

exports.booking = async (req, res) => {
    try {
      const { userId, email, amount, filmId } = req.body;
  
      if (!userId  || !email || !amount || !filmId) {
        return res.status(400).json({ message: "All fields are required", success: false });
      }
      let ticket = await Ticket.findOne({userId});
      if(!ticket){
        ticket = new Ticket({userId, amount, email, films : [filmId]})
      }else{
        if(ticket.films.includes(filmId)){
          return res.status(409).json({ message: "you booked this film", success: false });
        }
        ticket.films.push(filmId)
      }

  
     await ticket.save();
  
      return res.status(201).json({ 
        message: "Booking successful", 
        success: true, 
        status: 201, 
        data: ticket 
      });
      
    } catch (error) {
      console.error("Booking error:", error);
      return res.status(500).json({ message: "Failed to create ticket", success: false });
    }
};

exports.allTickets = async(req, res)=>{
  try {
    const {userId} = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID manquant" });
  }
  const tickets = await Ticket.find({userId})
  if(!tickets || tickets.length === 0){
    return res.status(404).json({ success: false, message: "No tickect founded with this id " });
  }
  return res.status(200).json({ success: true, data: tickets });

  } catch (error) {
    console.error("Erreur lors de la récupération des billets :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}
