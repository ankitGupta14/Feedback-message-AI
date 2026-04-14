'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/src/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/src/types/apiResponse"
import { Form } from "@/components/ui/form"

const Page = () => {
  const [username, setUsername] = useState<string>("")
  const [usernameMessage, setUsernameMessage] = useState<string>("")
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [debounceUsername] = useDebounceValue<string>(username, 300) // ✅ Destructured

  const router = useRouter()

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
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || "Error checking username.")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debounceUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success('Success', {
        description: response.data.message,
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error during sign-up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Sign-up Failed', {
        description: axiosError.response?.data.message,
      })
    } finally {
      setIsSubmitting(false) 
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
         <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >Feedback Myster</h1>
         <p className="mb-6">Create an account to get started</p>
      </div>
        <Form {...form}> 
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
            </form>
        </Form>
      </div>
    </div>
  )
}

export default Page