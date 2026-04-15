"use client";
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod'; 
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/src/schemas/verfiySchema';
import * as z from "zod";
import { toast } from "sonner"; // 
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/apiResponse';

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams<{username: string}>(); 

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });


  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
       const response =   await axios.post(`/api/verify-code`,{
            username: params.username,  
            code: data.code
         }) 
         toast({
            title: "Success",
            description: response.data.message
         })
         router.replace('sign-in')
    } catch (error) {
         console.error("Error during sign-up:", error);
              const axiosError = error as AxiosError<ApiResponse>;
              toast.error("Sign-up Failed", {
                description: axiosError.response?.data.message,
                variant: "destructive"
              });
            } 
              
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='"w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent on your email</p>
          
        </div>
        </div>
    </div>
  )
}

export default VerifyPage