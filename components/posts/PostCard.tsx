'use client'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'
import { Post } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'
import { ReportModal } from '@/components/ui/ReportModal'
import Link from 'next/link'

export function PostCard({ post, userId, onLike, onReport, showGroup = true }: {
  post: Post
  userId?: string
  onLike: (postId: string, liked: boolean) => void
  onReport: (postId: string, reason: string) => Promise<void>
  showGroup?: boolean
}) {
  const [showReport, setShowReport] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const anon = post.profiles?.anon_name || 'Utente anonimo'
  const group = post.groups
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: it })

  return (
    <>
      <div style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #3D2A1E', padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Avatar name={anon} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 14, color: '#E8A87C' }}>{anon}</div>
            <div style={{ fontSize: 11, color: '#5C4438', marginTop: 1, fontFamily: 'DM Sans, sans-serif' }}>
              {showGroup && group && <span style={{ color: group.color }}>{group.icon} {group.name} · </span>}
              {timeAgo}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(m => !m)} style={{ background: 'none', border: 'none', color: '#5C4438', fontSize: 18, padding: '4px 8px' }}>⋯</button>
            {showMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 10, padding: '4px 0', minWidth: 150, zIndex: 10 }}>
                <button onClick={() => { setShowReport(true); setShowMenu(false) }} style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#C47A7A', padding: '10px 16px', textAlign: 'left', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>⚑ Segnala</button>
              </div>
            )}
          </div>
        </div>
        <Link href={`/storie/${post.id}`} style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: 14, color: '#F0E6DC', lineHeight: 1.75, marginBottom: 14, fontFamily: 'Lora, serif' }}>{post.content}</p>
        </Link>
        <div style={{ display: 'flex', gap: 20, borderTop: '1px solid #3D2A1E', paddingTop: 12 }}>
          <button onClick={() => userId && onLike(post.id, !!post.user_liked)} style={{ background: 'none', border: 'none', color: post.user_liked ? '#C47A7A' : '#5C4438', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ fontSize: 16 }}>{post.user_liked ? '♥' : '♡'}</span> {post.like_count}
          </button>
          <Link href={`/storie/${post.id}`} style={{ color: '#5C4438', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ fontSize: 16 }}>○</span> {post.comment_count}
          </Link>
        </div>
      </div>
      {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={(reason) => onReport(post.id, reason)} contentType="post" />}
    </>
  )
}