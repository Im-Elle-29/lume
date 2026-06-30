import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/layout/AuthProvider'

export const metadata: Metadata = {
  title: 'Lume — Un luogo sicuro',
  description: 'Comunità anonime di supporto emotivo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" toastOptions={{
          style: { background: '#2E1F16', color: '#F0E6DC', border: '1px solid #3D2A1E', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }
        }} />
      </body>
    </html>
  )
}