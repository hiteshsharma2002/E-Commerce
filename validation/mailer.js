const nodemaier = require('nodemailer');

nodemaier.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

const sendMail = async (email, subject, content) => {
    
    try {
        
        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
            
        }

        WebTransport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }
            console.log('Mail sent', info.messageId);
            
        })

    }
    catch (err) {
        console.log(err);
    }

    
}

module.exports = {
    sendMail
}