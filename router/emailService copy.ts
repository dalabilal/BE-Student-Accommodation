import nodemailer from 'nodemailer';

export async function sendMail(email: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'laurianne.buckridge19@ethereal.email',
        pass: '9jqfGqkPqH84ZBpfUW'
    }
});

  const mailOptions = {
    from: 'student housing <dalahhashlamoon@gmail.com>',
    to: `${email}`,
    subject: 'Verification Code',
    text: `Your Account is active now, thank you!
           you can conntact us using this email dalaShatha@gmail.com
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
