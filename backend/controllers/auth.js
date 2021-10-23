import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer';
import sendgridMail from '@sendgrid/mail';

import userModel from '../models/user.js';

import { tryCatchUtility } from '../utils/errHandling/tryCatch.js';
import { generateErrUtility } from '../utils/errHandling/generateErr.js';

// signup
export const signupController =  tryCatchUtility(async (req, res) => {
    // checking if email already exists
    const existingEmail = await userModel.findOne({ email: req.body.email }, { _id: 1 }).lean();
    if(existingEmail) throw new generateErrUtility('Email already exists!',409);

    const newUser = JSON.parse(JSON.stringify(req.body));

    // encrypting password and adding it into user body
    delete newUser.password;
    newUser.password = await bcrypt.hash(req.body.password, 10);       // encrypt given password
    if(!newUser.password) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);

    // saving new user into user model
    const response = await userModel.create(newUser);
    if(!response) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);

    res.status(201).json({
        msg: 'Signup successful!',
        user: response
    });
});


// login
export let key;
export const loginController = tryCatchUtility(async (req, res, next) => {
    const { email, password } = req.body;

    // check email
    const response = await userModel.findOne({ email }).lean();
    if(!response) throw new generateErrUtility('Invalid credentials!',401);

    // check password
    const isPassValid = await bcrypt.compare(password, response.password);
    if(!isPassValid) throw new generateErrUtility('Invalid credentials!',401);

    // create token
    key = process.env.SERVER_SECRET + String(Math.random()).split('.')[1];
    const token = jwt.sign(
        { userid: response._id, username: response.username, group: response.ownership },
        key,
        { expiresIn: "12h" }
    );
    if(!token) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);

    res.status(200).json({
        msg: `${response.username} logged in successfully!`,
        user_group: response.ownership,
        token
    });
});

let otp, user_id;
// verify email
export const verifyEmailController = tryCatchUtility(async (req, res, next) => {
    // from update user controller
    // if(updates.password !== undefined) {
    //     delete updates.password;
    //     updates.password = await bcrypt.hash(req.body.password, 10);       // encrypt given password
    //     if(!updates.password) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);
    // }


    /*// let sender, format;
    // let sender=0, format=0;

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();
    // nodemailer.createTestAccount((err, account) => {
        // if(err) throw new generateErrUtility(err.message,500);

        // sender details
        const sender = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            // host: testAccount.smtp.host,
            // host: "account.smtp.host",
            // service: "hotmail",
            // service: "outlook",
            // port: 587,
            port: 465,
            // port: testAccount.smtp.port,
            // port: "account.smtp.port",
            // secure: false,      // true for 465, false for other ports
            // secure: testAccount.smtp.secure,
            // secure: "account.smtp.secure",
            // secure: true,
            // ssl: 'NO',
            auth: {
                user: testAccount.user,     // generated ethereal user
                // user: account.user,     // generated ethereal user
                pass: testAccount.pass      // generated ethereal password
                // pass: account.pass,     // generated ethereal user
            },
            tls: { rejectUnauthorized: false }      // when using localhost not actual domain
        });

        // console.log(req.body.email);
        // mail format
        const format = {
            from: '"🐬 Shank" <noreply@shank.com>',
            to: "payisif827@forfity.com",
            subject: "Email Confirmation!",
            text: "Hello.. this is text",
            html: "<b>Hello.. this is html</b>",
        };

    // });

    // console.log(sender, format);
    // sending mail
    const response = await sender.sendMail(format);*/


    const { body:{ email } } = req;

    // check if email exists
    // const isEmailValid = await userModel.findOne({ email }).lean();
    user_id = (await userModel.findOne({ email }).select('_id').lean() || {})._id;
    // console.log('id',user_id);
    // { _id:user_id } = await userModel.findOne({ email }).select('_id').lean()._id;
    // if(!isEmailValid) throw new generateErrUtility("This email doesn't exist!",401);
    if(!user_id) throw new generateErrUtility("This email doesn't exist!",401);

    const { SENDGRID_MAIL_APIKEY:sgm_key, sender_mail } = process.env;

    sendgridMail.setApiKey(sgm_key);

    otp = String(Math.random()).split('.')[1].substring(1,7);

    // mail format
    const format = {
        to: email,
        // from: { name: 'Shank 🐬', email: 'noreply@shank.com' },
        from: { name: 'Shank 🐬', email: sender_mail },
        // from: process.env.sender_mail,
        subject: "Email Confirmation for password reset!",
        // text: "Please click below link to reset password. http://google.com/",
        text: `Please use the below code to reset password in the app. ${otp}`,
        // html: "<h3>Please click below link to reset password.</h3><br><a href='google.com'><strong>Click here<strong></a>",
        html: `<h3>Please use the below code to reset password in the app.</h3><br><strong>${otp}<strong>`,
    };

    // sending mail
    const response = await sendgridMail.send(format);
    // sendgridMail
    //     .send(format)
    //     .then(response => res.status(response.statusCode).send('Email verification mail sent!\nPlease verify email to reset password...'))
    //     .catch(err => res.status(err.code).send(err.message));

    // console.log('response ->\t',response);
    if(!response) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);

    res.status(202).send('Email verification mail sent!\nPlease verify email to reset password...');
});

// reset pass
export const resetPassController = tryCatchUtility(async (req, res, next) => {
    // if(!otp || !user_id) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);
    // console.log(otp,user_id);

    if(otp && user_id) {
        const { body:{ otp:user_code, newPass } } = req;

        if(user_code !== otp) throw new generateErrUtility('Incorrect OTP!',401);       // verify user code

        if(!newPass) throw new generateErrUtility('Please enter password!',422);

        const password = await bcrypt.hash(newPass, 10);       // encrypt newPass
        if(!password) throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);

        const response = await userModel.findByIdAndUpdate(user_id, { password }, { new: true }).lean();
        if(!response) throw new generateErrUtility('Unable to reset password!\nPlease try again later...',500);

        res.status(200).send('Password changed successfully!\nYou can login now...');

    } else throw new generateErrUtility('Something went wrong!\nPlease try again later...',500);
});

