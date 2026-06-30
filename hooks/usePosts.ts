'use client'
import { useState, useEffect, useCallback } from 'react'
import { getClient } from '@/lib/supabase'
import { Post } from '@/types/database'

export function usePosts(groupId?: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20
  const supabase = getClient()

  const fetchPosts = useCallback(async (reset = false) => {
    setLoading(true)
    const currentPage = reset ? 0 : page
    let query = supabase.from('posts')
      .select('*, profiles!posts_author_id_fkey(anon_name), groups(name, color, icon)')
      .eq('is_removed', false).order('created_at', { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)
    if (groupId) query = query.eq('group_id', groupId)
    const { data } = await query
    const newPosts = (data as Post[]) || []
    if (reset) { setPosts(newPosts); setPage(1) }
    else { setPosts(prev => [...prev, ...newPosts]); setPage(p => p + 1) }
    setHasMore(newPosts.length === PAGE_SIZE)
    setLoading(false)
  }, [groupId, page])

  useEffect(() => { fetchPosts(true) }, [groupId])

  const createPost = useCallback(async (content: string, gId: string, authorId: string) => {
    const { data, error } = await supabase.from('posts')
      .insert({ content, group_id: gId, author_id: authorId })
      .select('*, profiles!posts_author_id_fkey(anon_name), groups(name, color, icon)').single()
    if (error) throw error
    setPosts(prev => [data as Post, ...prev])
    return data
  }, [])

  const toggleLike = useCallback(async (postId: string, userId: string, liked: boolean) => {
    if (liked) await supabase.from('post_likes').delete().match({ post_id: postId, user_id: userId })
    else await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, like_count: p.like_count + (liked ? -1 : 1), user_liked: !liked } : p))
  }, [])

  const checkLikes = useCallback(async (postIds: string[], userId: string) => {
    const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', userId).in('post_id', postIds)
    const likedSet = new Set((data || []).map((l: any) => l.post_id))
    setPosts(prev => prev.map(p => ({ ...p, user_liked: likedSet.has(p.id) })))
  }, [])

  const reportPost = useCallback(async (postId: string, reporterId: string, reason: string) => {
    await supabase.from('reports').insert({ reporter_id: reporterId, content_type: 'post', content_id: postId, reason })
  }, [])

  return { posts, loading, hasMore, fetchPosts, createPost, toggleLike, checkLikes, reportPost }
}