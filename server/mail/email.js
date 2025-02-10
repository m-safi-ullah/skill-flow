import { transporter } from "./config.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    await transporter.sendMail({
      from: '"Skill Flow" <astragalaxyllc@gmail.com>',
      to: email,
      subject: "Confirm Your Email Address",
      text: `Hello,
          
          Thank you for signing up with Skill Flow. Please use the verification code below to confirm your email address:
          
          Verification Code: ${verificationCode}
          
          If you did not sign up for an account, please ignore this email.
          
          Best regards,
          Skill Flow Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Confirm Your Email Address</h2>
          <p>Hi there,</p>
          <p>Thank you for signing up with <strong>Skill Flow</strong>. Please use the code below to verify your email address:</p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; margin: 20px 0; font-size: 18px; font-weight: bold; text-align: center;">
            ${verificationCode}
          </div>
          <p>If you did not sign up for an account, please ignore this email.</p>
          <p style="margin-top: 20px;">Best regards,<br><strong>Skill Flow Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendVerifyEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"Skill Flow Support" <astragalaxyllc@gmail.com>',
      to: email,
      subject: "Your One-Time Password (OTP) for Account Verification",
      text: `Dear User,\n\nYou have requested an OTP for account verification.\n\nYour OTP code is: ${verificationCode}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nSkill Flow Support Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Dear User,</p>
          <p>You have requested a One-Time Password (OTP) for account verification.</p>
          <p style="font-size: 18px; font-weight: bold; color: #007bff;">
            Your OTP code: <span style="background: #f4f4f4; padding: 5px 10px; border-radius: 5px;">${verificationCode}</span>
          </p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best Regards,<br><strong>Skill Flow Support Team</strong></p>
        </div>
      `,
    });
    return response;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email. Please try again.");
  }
};
