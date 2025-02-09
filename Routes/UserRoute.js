const express = require('express');
const { signUp, login } = require('../Controller/UserController');
const { isAuth } = require('../Middlewares/auth');
const { validationRes, validateUserSignUp, validateSignin } = require('../Middlewares/validation/user');
const { booking,allTickets } = require('../Controller/TicketController');
const { createList, removeFromList, getByUserId } = require('../Controller/WishListController');

const router = express.Router()

router.use(express.json())


router.post("/signUp",validateUserSignUp,validationRes,signUp)

router.post('/login', validateSignin, validationRes, login)
router.get('/list/:userId',isAuth ,getByUserId)

// Routes need authorization 
router.post('/booking',isAuth, booking )
router.post('/wishList', isAuth, createList)
router.delete('/deletFromList',isAuth, removeFromList)
router.get("/allTickets/:userId", isAuth, allTickets)

module.exports = router