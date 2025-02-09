const mongoose = require('mongoose')
const bcrypte = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true

    },
    tickets : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Ticket",
    }]
})
UserSchema.pre('save', function(next){
    if(this.isModified('password')){
     bcrypte.hash(this.password, 8, (err, hash)=>{
         if(err) return next(err);
         this.password = hash;
         next();
 
     })
    }
 
 })

UserSchema.statics.isThisEmailUsed = async function(email) {
    if(!email) return new Error('Invalid Email');
    try {
        const user = await this.findOne({email})
        if(user) return false;

        return true 
    } catch (error) {
        console.log("Error at ", error.message)
        return false
    }
    
}


UserSchema.methods.comparePassword = async function(password){
    if(!password) throw new Error('password is missing, can not compare')
    try {
       const result =  await bcrypte.compare(password, this.password)
       return result
    } catch (error) {
       console.log("Error while comparing this password ", error.message )
    }
}




const User = mongoose.models.User || mongoose.model('User', UserSchema )
module.exports= User