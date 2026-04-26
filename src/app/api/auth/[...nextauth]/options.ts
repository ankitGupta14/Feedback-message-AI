import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",    // ✅ lowercase — sign-in page se match karta hai
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },  // ✅ identifier
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password.");
          }
        } catch (err: any) {
          throw new Error(err.message);
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAccpectMessage = token.isAccpectMessage;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();  // ✅ token.id → token._id
        token.isVerified = user.isVerified;
        token.isAccpectMessage = user.isAccpectMessage;
        token.username = user.username;
      }
      return token;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};