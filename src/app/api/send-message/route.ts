import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
    
  try {
    const user = await UserModel.findOne({username})
     if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // user is accepting the messages 
    if (!user.isAccpectingMessages) {
        return Response.json(
            {
                success: false,
                message: "User is not accepting messages.",
            },
            { status: 400 }
        );
    }


const newMessage  = {
    content,
    createdAt: new Date()
}
user.messages.push(newMessage as Message);
await user.save();
return Response.json(
    {
        success: true,
        message: "Message sent successfully.",
    },
    { status: 200 }
);
  } catch (error) {
    console.error("Error sending message", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while sending message.",
      },
      { status: 500 }
    );
  }

}