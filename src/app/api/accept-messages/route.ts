import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { accpectMessages } = await request.json();

  try {
   const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: accpectMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User preference updated successfully.",
        updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user preference");
    return Response.json(
      {
        success: false,
        message: "An error occurred while updating user preference.",
      },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId)
     if (!foundUser) {
        return Response.json(
          {
            success: false,
            message: "User not found.",
          },
          { status: 404 }
        );
      }
      return Response.json(
          {
            success: true,
            isAccpectingMessage: foundUser.isAccpectingMessages
          },
          { status: 200 }
        );
  } catch (error) {
    console.error("Error updating user preference");
    return Response.json(
      {
        success: false,
        message: "Error is getting message acceptance status.",
      },
      { status: 500 }
    );
  }
}
