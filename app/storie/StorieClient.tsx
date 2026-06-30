'use client'
import { useState, useEffect } from 'react'
import { Group } from '@/types/database'
import { usePosts } from '@/hooks/usePosts'
import { PostCard } from '@/components/posts/PostCard'
import { NewPostForm } from '@/components/posts/NewPostForm'
import toast from 'react-hot-toast'

export function StorieClient({ groups, anonName, userId }: { groups: Group[]; anonName: string; userId?: string }) {
  const [showForm, setShowForm] = useState(false)
  const { posts, loading, hasMore, fetchPosts, createPost, toggleLike, checkLikes, reportPost } = usePosts()

  useEffect(() => {
    if (userId && posts.length > 0) checkLikes(posts.map(p => p.id), userId)
  }, [posts.length, userId])

async function handleCreate(content: string, groupId: string) {
    if (!userId) { toast.error('Non autenticato'); return }
    try { 
      await createPost(content, groupId, userId)
      setShowForm(false)
      toast.success('Storia pubblicata 🌿') 
    }
    catch (e: any) { 
      console.error('ERRORE PUBBLICAZIONE:', e)
      toast.error(e?.message || JSON.stringify(e)) 
    }
  }

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <button onClick={() => setShowForm(s => !s)} style={{ width: '100%', background: showForm ? '#C4845A22' : '#2E1F16', border: `1px solid ${showForm ? '#C4845A55' : '#3D2A1E'}`, borderRadius: 14, padding: '14px 18px', marginBottom: 20, color: '#A08878', textAlign: 'left', fontSize: 14, fontFamily: 'Lora, serif', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>✦</span>
        <span style={{ color: '#5C4438' }}>Cosa vuoi condividere?</span>
        <span style={{ marginLeft: 'auto', color: '#C4845A', fontSize: 18 }}>{showForm ? '✕' : '+'}</span>
      </button>
      {showForm && <NewPostForm groups={groups} anonName={anonName} onSubmit={handleCreate} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading && posts.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #3D2A1E', padding: '18px', height: 180, opacity: 0.5 }} />)
        ) : posts.map(post => (
          <PostCard key={post.id} post={post} userId={userId}
            onLike={(postId, liked) => userId && toggleLike(postId, userId, liked)}
            onReport={async (postId, reason) => { if (!userId) return; await reportPost(postId, userId, reason); toast.success('Segnalazione inviata') }}
            showGroup />
        ))}
      </div>
      {hasMore && posts.length > 0 && (
        <button onClick={() => fetchPosts()} style={{ width: '100%', background: 'transparent', border: '1px solid #3D2A1E', borderRadius: 12, padding: '14px', marginTop: 16, color: '#A08878', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
          {loading ? 'Caricamento...' : 'Carica altre storie'}
        </button>
      )}
      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5C4438' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Ancora nessuna storia.<br />Sii il primo a condividere.</p>
        </div>
      )}
    </div>
  )
}