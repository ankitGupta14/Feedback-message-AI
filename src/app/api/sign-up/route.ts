import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken. Please choose another one.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verfiyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already in use. Please use another email.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verfiyCode = verfiyCode;
        existingUserByEmail.verfiyCodeExpire = new Date(Date.now() + 60 * 60 * 1000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verfiyCode,
        isVerified: false,
        verfiyCodeExpire: expiryDate,
        isAccpectingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    // ✅ Fix — email pehle, username baad mein
    const emailResponse = await sendVerificationEmail(
      email,      // ← email pehle
      username,   // ← username baad mein
      verfiyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message:
            emailResponse.message ||
            "Failed to send verification email. Please try again later.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent successfully. Please check your inbox.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error during sign-up:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred during sign-up. Please try again later.",
      },
      { status: 500 }
    );
  }
}