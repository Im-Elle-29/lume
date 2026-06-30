'use client'
import { useState, useEffect, useCallback } from 'react'
import { getClient } from '@/lib/supabase'
import { Message } from '@/types/database'

export function useChat(groupId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getClient()

  useEffect(() => {
    if (!groupId) return
    supabase.from('messages').select('*, profiles(anon_name)')
      .eq('group_id', groupId).eq('is_removed', false)
      .order('created_at', { ascending: true }).limit(100)
      .then(({ data }) => { setMessages((data as Message[]) || []); setLoading(false) })

    const channel = supabase.channel(`chat:${groupId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${groupId}` },
        async (payload) => {
          const { data: profile } = await supabase.from('profiles').select('anon_name').eq('id', payload.new.author_id).single()
          setMessages(prev => [...prev, { ...payload.new, profiles: profile } as Message])
        })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [groupId])

  const sendMessage = useCallback(async (content: string, authorId: string) => {
    if (!content.trim()) return
    const { error } = await supabase.from('messages').insert({ group_id: groupId, author_id: authorId, content: content.trim() })
    if (error) throw error
  }, [groupId])

  const reportMessage = useCallback(async (messageId: string, reporterId: string, reason: string) => {
    await supabase.from('reports').insert({ reporter_id: reporterId, content_type: 'message', content_id: messageId, reason })
  }, [])

  return { messages, loading, sendMessage, reportMessage }
}