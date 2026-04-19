'use client'
import { Message } from "@/src/model/User"
import { AccpectMessageSchema } from "@/src/schemas/accpectMessageSchema"
import { ApiResponse } from "@/src/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSWitchLoading, setIsSwitchLoading] = useState(false)

const handleDeleteMessage = (messageId: string) => {
  setMessages(messages.filter((message) => message._id !== messageId))
}


const {data: session} = useSession()
const form = useForm({
  resolver: zodResolver(AccpectMessageSchema)
})

const {register, watch, setValue} = form

const accpectMessages = watch("accpectMessages")

const fetchAccpectMessages = useCallback(async () => {
  setIsSwitchLoading(true)
   
  try {
    const response = await axios.get<ApiResponse>("/api/accept-messages")
    setValue("accpectMessages", response.data.isAcceptingMessage)

  } catch (error) {
    
    const axiosError = error as AxiosError<ApiResponse>
  }

}, [setValue])

  return (
    <div>dashboard</div>
  )
}

export default page