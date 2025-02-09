const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    films: [{
        type: String,
        required: true
    }],
    email: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true }); 


 const Ticket = mongoose.models.Ticket|| mongoose.model('Ticket', TicketSchema);
module.exports = Ticket