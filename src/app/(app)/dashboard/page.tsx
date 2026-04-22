'use client'
import { Message, User } from "@/src/model/User"
import { AccpectMessageSchema } from "@/src/schemas/accpectMessageSchema"
import { ApiResponse } from "@/src/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCcw, Copy } from "lucide-react"
import MessageCard from "@/components/MessageCard"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

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
      setValue("accpectMessages", response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {
        description: axiosError.response?.data.message || "Error fetching user preference.",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Refreshed", {
          description: "Messages have been refreshed.",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to fetch messages.",
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setMessages, setIsLoading])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAccpectMessages()
  }, [session, setValue, fetchAccpectMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        accpectMessages: !accpectMessages
      })
      setValue("accpectMessages", !accpectMessages)
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

  // ✅ Fix 1 — session check pehle karo
  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Please login to view dashboard.</p>
      </div>
    )
  }

  // ✅ Fix 2 — session check ke baad use karo
  const { username } = session.user as User

  // ✅ Fix 3 — const copyToClipboard = () syntax fix
  const copyToClipboard = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`
    navigator.clipboard.writeText(profileUrl)
    toast.success("Copied to clipboard", {
      description: "Your profile URL has been copied to clipboard.",
    })
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md w-full max-w-6xl">

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome back, <span className="font-semibold text-black dark:text-white">{username}</span></p>

      {/* Copy Link Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Unique Profile Link</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full border rounded-md p-2 text-sm bg-gray-100 dark:bg-gray-800"
          />
          <Button onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Accept Messages Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <Switch
          {...register("accpectMessages")}
          checked={accpectMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm font-medium">
          Accept Messages:{" "}
          {accpectMessages ? (
            <span className="text-green-500 font-bold">On</span>
          ) : (
            <span className="text-red-500 font-bold">Off</span>
          )}
        </span>
      </div>

      <Separator className="my-6" />

      {/* Messages Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Messages</h2>
        <Button
          variant="outline"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id?.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <p className="text-gray-500 text-lg">No messages yet.</p>
            <p className="text-gray-400 text-sm mt-2">Share your profile link to get messages!</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Page;