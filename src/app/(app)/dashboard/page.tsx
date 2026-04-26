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
import { Loader2, RefreshCcw, Copy, MessageSquare, Link2, Settings } from "lucide-react"
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

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const { username } = session.user as User

  const copyToClipboard = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`
    navigator.clipboard.writeText(profileUrl)
    toast.success("Copied!", {
      description: "Profile URL copied to clipboard.",
    })
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {username}
                </span>
              </h1>
              <p className="text-gray-500 text-sm">Manage your anonymous feedback</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Messages</p>
                <p className="text-white text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Settings className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <p className={`text-lg font-bold ${accpectMessages ? "text-green-400" : "text-red-400"}`}>
                  {accpectMessages ? "Accepting" : "Paused"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Profile Link</p>
                <p className="text-white text-sm font-medium truncate max-w-[120px]">
                  /u/{username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-6">
          <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-purple-400" />
            Your Unique Profile Link
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Share this link to receive anonymous messages
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full bg-gray-700/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 shrink-0"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Toggle */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-400" />
                Accept Messages
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Toggle to start or stop receiving anonymous messages
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${accpectMessages ? "text-green-400" : "text-red-400"}`}>
                {accpectMessages ? "On" : "Off"}
              </span>
              <Switch
                {...register("accpectMessages")}
                checked={accpectMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                All Messages
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                {messages.length} message{messages.length !== 1 ? "s" : ""} received
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id?.toString()}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-gray-400 text-lg font-medium">No messages yet</p>
                <p className="text-gray-600 text-sm mt-2">
                  Share your profile link to start receiving anonymous messages!
                </p>
                <Button
                  onClick={copyToClipboard}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Profile Link
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page;