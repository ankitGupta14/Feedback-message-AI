'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import *as z from "zod"
import Link from "next/link"
import {useEffect, useState} from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/src/schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/src/types/apiResponse"

export const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmiting, setIsSubmitting] = useState(false)
  const debounceUsername = useDebounceValue(username, 300)
  const router = useRouter()
  
  // Zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",

    }
  })
    
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debounceUsername) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
        const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
        setUsernameMessage(response.data.message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || "An error occurred while checking username.")
        }finally{
          setIsCheckingUsername(false)
        }
      }
  } 
  checkUsernameUnique()
}, [debounceUsername])

     const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)
      try {
      const response =  await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response.data.message, 
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)

      } catch (error) {
        console.error("Error during sign-up:", error)
         const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message
        toast({
          title: 'Sign-up Failed',
          description: errorMessage,
          variant: 'destructive',
        })
        setIsSubmitting(false)
      }
     }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
     
    </div>
    </div>
  )
}
export default Page