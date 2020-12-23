const nodemailer = require('nodemailer');

exports.sendMailSingUp = (mailSignup) => {
    const accountValue = process.env.ACCOUNT;
    const passValue = process.env.PASS;

    let transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: accountValue,
            pass: passValue
        }
    });

    const mailOptions = {
        from: "Streaming Learning",
        to: mailSignup,
        subject: 'Streaming Learning',
        html: '<h1>You have successfully logged in to Streaming Learning</h1><div>@2021</div>'
    };

    transport.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent to: " + mailSignup);
        }
    });
};

