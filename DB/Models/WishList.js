const mongoose = require('mongoose')

const WishListSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    films : [{
        type : String,
        required : true
    }]
})

const WishList = mongoose.models.WishList || mongoose.model('WishList', WishListSchema)
module.exports = WishList