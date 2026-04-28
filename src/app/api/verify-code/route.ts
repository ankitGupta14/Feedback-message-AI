import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOneAndUpdate({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verfiyCode === code;
    const isCodeNotExpired = new Date(user.verfiyCodeExpire) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;

      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully.",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired please signup again to get a new code .",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code pls try again later.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verify user", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while verifying user.",
      },
      { status: 500 }
    );
  }
}
