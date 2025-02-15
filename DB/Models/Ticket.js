const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    filmId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    },
    
    statusPayment : {
        type : String,
        default : false
    },
    quantite : {
        type : Number, 
        required : true
    }
}, { timestamps: true }); 


 const Ticket = mongoose.models.Ticket|| mongoose.model('Ticket', TicketSchema);
module.exports = Ticket