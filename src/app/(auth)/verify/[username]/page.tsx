"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/src/schemas/verfiySchema';
import * as z from "zod";
import { toast } from "sonner";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams<{username: string}>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
      })
      toast.success("Verified!", {
        description: response.data.message
      })
      router.replace('/sign-in')
    } catch (error) {
      console.error("Error during verification:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Verification Failed", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-700/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Card */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">

          {/* Logo + Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">
              Verify Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Email hint */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 mb-6 text-center">
            <p className="text-purple-300 text-sm">
              📧 Code sent to your registered email
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 183110"
                        maxLength={6}
                        className="bg-gray-700/50 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-14 text-center text-2xl font-bold tracking-[0.5em]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-xs text-center">
                      Enter the 6 digit code sent to your email. Expires in 1 hour.
                    </FormDescription>
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
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Verify Account
                  </>
                )}
              </Button>

            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs">Didn't get the code?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Resend hint */}
          <p className="text-center text-gray-500 text-xs">
            Check your spam folder or{" "}
            <span
              className="text-purple-400 cursor-pointer hover:text-purple-300"
              onClick={() => router.replace('/sign-up')}
            >
              sign up again
            </span>
          </p>

        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Protected by Feedback Mystery security. 🔐
        </p>

      </div>
    </div>
  )
}

export default VerifyPage;