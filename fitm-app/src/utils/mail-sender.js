const nodemailer = require('nodemailer')
const sgMail = require("@sendgrid/mail")
const hbs = require('nodemailer-express-handlebars');
const path = require("path")
const {
    SENDGRID_API_KEY,
    EMAIL
} = require("../../config/config")

exports.sendMailEthereal = async (msg) => {
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'odessa.kutch59@ethereal.email', // generated ethereal user
            pass: '4uRa7D6MnJUGB2KMgN', // generated ethereal password
        }
    });

    const handlebarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve('./views'),
            defaultLayout: false
        },
        viewPath: path.resolve('./views'),
        extName: ".handlebars"
    }

    transporter.use('compile', hbs(handlebarOptions))

    // send mail with defined transport object
    transporter.sendMail(msg, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email has been sent: ' + info.response);
        }
    });
}