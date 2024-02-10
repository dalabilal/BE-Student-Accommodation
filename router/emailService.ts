import nodemailer from 'nodemailer';

export async function sendVerificationCode(email: string, verificationCode: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mack65@ethereal.email',
        pass: 'tng7Pr1Cf9AmDvS3fw'
    }
});

  const mailOptions = {
    from: 'student housing <dalahhashlamoon@gmail.com>',
    to: `${email}`,
    subject: 'Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
