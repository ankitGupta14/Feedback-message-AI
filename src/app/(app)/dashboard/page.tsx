'use client'
import { Message } from "@/src/model/User"
import { AccpectMessageSchema } from "@/src/schemas/accpectMessageSchema"
import { ApiResponse } from "@/src/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  // ✅ Fix 1 — .toString() add kiya
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(
      (message) => message._id?.toString() !== messageId
    ))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AccpectMessageSchema)
  })

  const { register, watch, setValue } = form
  const accpectMessages = watch("accpectMessages")

  const fetchAccpectMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")

      // ✅ Fix 2 — ?? false add kiya
      setValue("accpectMessages", response.data.isAcceptingMessage ?? false)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      // ✅ Fix 3 — Sonner syntax
      toast.error("Error", {
        description: axiosError.response?.data.message || "Error fetching user preference.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) {
        // ✅ Fix 3 — Sonner syntax
        toast.success("Refreshed", {
          description: "Messages have been refreshed.",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      // ✅ Fix 3 — Sonner syntax
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to fetch messages.",
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setMessages, setIsLoading])

  useEffect(() => {
    if (!session || !session.user) return  // ✅ !session.user fix kiya
    fetchMessages()
    fetchAccpectMessages()
  }, [session, setValue, fetchAccpectMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        accpectMessages: !accpectMessages
      })
      setValue("accpectMessages", !accpectMessages)
      // ✅ Fix 3 — Sonner syntax
      toast.success(response.data.message, {
        description: "User preference updated successfully.",
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to update preference.",
      })
    }
  }

  if(!session || !session.user) {
    return <div>Please login </div>
  }

  return (
    <div>dashboard</div>
  )
}

export default Page;