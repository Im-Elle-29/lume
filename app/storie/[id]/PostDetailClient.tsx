'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'
import { Post, Comment } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'
import { ReportModal } from '@/components/ui/ReportModal'
import { getClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function PostDetailClient({ post, comments: initialComments, userId, anonName }: { post: Post; comments: Comment[]; userId?: string; anonName: string }) {
  const [liked, setLiked] = useState(post.user_liked || false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = getClient()
  const anon = post.profiles?.anon_name || 'Anonimo'
  const group = post.groups

  async function toggleLike() {
    if (!userId) return
    if (liked) { await supabase.from('post_likes').delete().match({ post_id: post.id, user_id: userId }); setLikeCount(l => l - 1) }
    else { await supabase.from('post_likes').insert({ post_id: post.id, user_id: userId }); setLikeCount(l => l + 1) }
    setLiked(l => !l)
  }

  async function submitComment() {
    if (!newComment.trim() || !userId || loading) return
    setLoading(true)
    const { data, error } = await supabase.from('comments').insert({ post_id: post.id, author_id: userId, content: newComment.trim() }).select('*, profiles(anon_name)').single()
    if (!error && data) { setComments(c => [...c, data as Comment]); setNewComment(''); toast.success('Commento aggiunto') }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px 20px 120px' }}>
      <div style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #3D2A1E', padding: '20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Avatar name={anon} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 16, color: '#E8A87C' }}>{anon}</div>
            <div style={{ fontSize: 11, color: '#5C4438', fontFamily: 'DM Sans, sans-serif' }}>
              {group && <span style={{ color: group.color }}>{group.icon} {group.name} · </span>}
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: it })}
            </div>
          </div>
          <button onClick={() => setShowReport(true)} style={{ background: 'none', border: 'none', color: '#5C4438', fontSize: 18 }}>⋯</button>
        </div>
        <p style={{ fontSize: 15, color: '#F0E6DC', lineHeight: 1.8, fontFamily: 'Lora, serif', marginBottom: 18 }}>{post.content}</p>
        <div style={{ display: 'flex', gap: 20, borderTop: '1px solid #3D2A1E', paddingTop: 14 }}>
          <button onClick={toggleLike} style={{ background: 'none', border: 'none', color: liked ? '#C47A7A' : '#5C4438', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ fontSize: 18 }}>{liked ? '♥' : '♡'}</span> {likeCount}
          </button>
          <span style={{ color: '#5C4438', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ fontSize: 18 }}>○</span> {comments.length}
          </span>
        </div>
      </div>

      <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 16, color: '#F0E6DC', marginBottom: 16, fontWeight: 400 }}>Risposte ({comments.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {comments.map(c => (
          <div key={c.id} style={{ background: '#2E1F16', borderRadius: 12, border: '1px solid #3D2A1E', padding: '14px' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <Avatar name={c.profiles?.anon_name || 'Anonimo'} size={28} />
              <div>
                <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 12, color: '#E8A87C' }}>{c.profiles?.anon_name || 'Anonimo'}</div>
                <div style={{ fontSize: 10, color: '#5C4438', fontFamily: 'DM Sans, sans-serif' }}>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: it })}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#F0E6DC', lineHeight: 1.65, fontFamily: 'Lora, serif' }}>{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: '#5C4438', fontSize: 13, textAlign: 'center', padding: '20px 0', fontFamily: 'DM Sans, sans-serif' }}>Sii il primo a rispondere con gentilezza.</p>}
      </div>

      {userId && (
        <div style={{ position: 'fixed', bottom: 70, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#261A13', borderTop: '1px solid #3D2A1E', padding: '10px 16px 12px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={`Rispondi come ${anonName}...`} rows={1} maxLength={500} style={{ flex: 1, borderRadius: 20, padding: '10px 16px', resize: 'none', fontSize: 14 }} />
          <button onClick={submitComment} disabled={!newComment.trim() || loading} style={{ background: newComment.trim() ? '#C4845A' : '#3D2A1E', border: 'none', borderRadius: 20, width: 42, height: 42, flexShrink: 0, color: newComment.trim() ? '#1C1410' : '#5C4438', fontSize: 16 }}>↑</button>
        </div>
      )}
      {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={async (reason) => { if (!userId) return; await supabase.from('reports').insert({ reporter_id: userId, content_type: 'post', content_id: post.id, reason }); toast.success('Segnalazione inviata') }} contentType="post" />}
    </div>
  )
}