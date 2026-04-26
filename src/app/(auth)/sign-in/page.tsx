"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";

const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Sign-in Failed", {
          description: "Invalid email or password.",
        });
      }

      if (result?.url) {
        toast.success("Welcome Back!", {
          description: "Signed in successfully!",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error("Sign-in Failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-700/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Card */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Back
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Email or Username */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Email / Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email or username"
                        className="bg-gray-700/50 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Password
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        className="bg-gray-700/50 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-11 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs">Don't have an account?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign Up Link */}
          <Link href="/sign-up">
            <Button
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl h-11"
            >
              Create Account
            </Button>
          </Link>

        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Protected by Feedback Mystery security.
        </p>

      </div>
    </div>
  );
};

export default Page;