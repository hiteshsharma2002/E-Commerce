const express = require("express");
const router1 = express.Router();
const usermong = require("../models/Mongo_user");
const cartmong = require('../models/Mongo_cart');
const addmong = require('../models/Mongo_address');
const bcrypt = require('bcrypt');
const RazorPay = require('razorpay');

const mailer = require('../validation/mailer');

const razorpay = new RazorPay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// it is validation function which we have to import to use below:
const { validationResult } = require('express-validator');

// import validation file
const { registeredValidator } = require('../validation/validation');

router1.post("/signup",registeredValidator, async (req, res) => {
  try {
    const { name, email, mobile, pass } = req.body;

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ message: error.array()[0].msg });
    }

    const existUser = await usermong.findOne({ email });

    const hashedPassword = await bcrypt.hash(pass, 10);

    if (existUser) {
       return res.status(400).json({ message: 'User with this email already registered' });
    }

    const newUser = new usermong({
      name,
      email,
      mobile,
      pass: hashedPassword,
    });

    const saveUser=await newUser.save();
    
    const msg = `${name} you have been registered to e commerce website.Please verify if its is you <a href="http://localhost:3000/mail-verification?id=${saveUser._id}">Verify</a> `;

    mailer.sendMail(email, 'Mail Verification', msg);

      return res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.send("error");
  }
});

router1.post('/login',async (req,res) => {
  
  try {
    const { email, pass } = req.body;

    const userr = await usermong.findOne({ email });

    if (!userr) {
      return res.status(404).json({success:false, message: 'User not found' });
    }

    const passmatch = await bcrypt.compare(pass, userr.pass);

    if (passmatch) {
      req.session.userEmail = {
        name: userr.name,
        email: userr.email
      };
      console.log(req.session);
      return res.json({ success: true, message: 'Login successfull', backid: { email:userr.email, name:userr.name } });
    } else {
      return res.status(401).json({success:false, message: 'Incorrect Password' });
    }
  }
  catch (err) {
    res.json(err.message);
  }
})

// ------------------------------------- cart items


router1.post('/cart-items', async (req, res) => {
  
  const email = req.email;

  if (!email) {
    return res.status(300).json({ message: 'Please login first' });
  }

  try {

    const { product, price, discount, avail ,image} = req.body;

    if (avail.toLowerCase() === 'out of stock') {
      return res.status(400).json({ message: 'Item is out of stock' });
    }
    
    const newCart = new cartmong({
      product, price, discount, avail, 
      image,email
  
    })
    

    await newCart.save();
    res.status(201).json({ message: 'Item added to cart' });

  }

  catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }

})

// cart remove -----------------------------------

router1.post('/cart-remove',async (req,res) => {
  
  try {
    const { id } = req.body;
    await cartmong.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item removed successfully' });
  }
  catch (err) {
    res.status(500).json({ message: 'Item can"t br removed' });
  }

})

// cart-details ----------------------------------------

router1.get('/cart-details',async (req,res) => {
  const email = req.email;

  if (!email) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  try {
    const cartData = await cartmong.find({ email });

    res.json(cartData);
  }
  catch (err) {
    res.json('Error in fetching cart')
  }

})

// -------------------------------------fetch user

router1.get('/fetch-user', async (req, res) => {
  const user = req.session.userEmail;

  if (!user) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  try {
    const { name, email } = user;
    res.json({ name, email });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// --------------------------------------- address

router1.post('/user-address', async (req, res) => {

  const email = req.email;
  
  if (!req.session.userEmail) {
    return res.status(401).json({ error: "User not logged in" });
  }
  
  const { name, street, city, state, zip } = req.body;

  try {
    
  const newAdd = new addmong({
    name, street, city, state, zip,email
  })
    
    await newAdd.save();
    res.status(200).json({ message: 'address added successfully' });
  }
  catch (err) {
    res.json(err);
  }

})

router1.get('/fetch-address', async (req, res) => {
  
  const email = req.email;
  
  const address = await addmong.find({ email });
  res.json(address);
})

// --------------------------------------- logout


router1.get('/user-logout', function (req, res) {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      // return res.send('cannot logout');
      res.json({message:'cannot logout'});
    }
    // res.render('adminLogin');
    res.json({ message: 'Logout successfull' });
  })
  
})

// razorpay -----------------------------------------

router1.post('/create-order', async (req, res) => {
  
  const { total } = req.body;

  const options = {
    amount: total * 100,
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json( order);
    
  }
  catch (err) {
    res.status(500).json({ message: err.message });
    console.log({ message: err.message });
  }

})

module.exports = router1;
