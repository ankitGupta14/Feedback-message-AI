'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, Loader2, Sparkles, RefreshCcw } from 'lucide-react'

const messageSchema = z.object({
  content: z.string().min(10, "Message must be at least 10 characters.").max(300, "Message must be at most 300 characters."),
})

function MessagePage() {
  const params = useParams<{ username: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([
    "What do you think is my biggest strength?",
    "What's one thing I should improve?",
    "How do I make you feel when we talk?",
    "What's your honest opinion about me?",
  ])

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  })

  // axios se AI suggestions fetch kra ga 
  const fetchSuggestions = async () => {
    setIsSuggesting(true)
    try {
      const response = await axios.post('/api/suggest-messages', {
        messages: []
      }, {
        responseType: 'text'
      })
      const text = response.data as string
      const parsed = text.split('||').map((s: string) => s.trim()).filter(Boolean)
      if (parsed.length > 0) {
        setSuggestions(parsed)
        toast.success("New suggestions loaded!")
      }
    } catch (error) {
      toast.error("Could not load suggestions.")
    } finally {
      setIsSuggesting(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.content,
      })
      toast.success("Message Sent!", {
        description: response.data.message,
      })
      form.reset()
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast.error("Failed to send", {
        description: axiosError.response?.data.message || "Something went wrong.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-700/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Send to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              @{params.username}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">100% Anonymous 🔒</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm">
                      Your Anonymous Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your honest feedback here..."
                        className="bg-gray-700/50 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 rounded-xl min-h-[140px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormMessage className="text-red-400 text-xs" />
                      <p className="text-gray-600 text-xs">{field.value.length}/300</p>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 rounded-xl"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" />Send Message</>
                )}
              </Button>
            </form>
          </Form>

          {/* AI Suggestions */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-400" />
                AI Suggested Messages
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSuggestions}
                disabled={isSuggesting}
                className="border-white/10 text-gray-400 hover:bg-white/5 rounded-xl text-xs"
              >
                {isSuggesting ? (
                  <><Loader2 className="h-3 w-3 animate-spin mr-1" />Loading...</>
                ) : (
                  <><RefreshCcw className="h-3 w-3 mr-1" />Refresh</>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              {suggestions.map((message, index) => (
                <button
                  key={index}
                  onClick={() => form.setValue("content", message)}
                  className="w-full text-left text-sm text-gray-400 bg-gray-700/30 hover:bg-purple-500/10 hover:text-purple-300 border border-white/5 hover:border-purple-500/20 rounded-xl px-4 py-3 transition-all duration-200"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by <span className="text-purple-400">Feedback Mystery</span> 🔐
        </p>
      </div>
    </div>
  )
}

export default MessagePage