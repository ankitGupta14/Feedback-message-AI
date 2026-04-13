import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {success, z} from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result)
        if (!result.success) {
            const UsernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            )
        }

        const { username } = result.data;

       const exitingVerifiedUser = await UserModel.findOne({ username, isVerified:true})
         if (exitingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken by a verified user.",
            }, { status: 409 })
         }
             
            return Response.json({
                success: true,
                message: "Username is Unique.",
            }, { status: 200 });

    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json(
           {
            success: false,
            message: "An error occurred while checking username uniqueness."
           },
              { status: 500 }
        )
    }
}