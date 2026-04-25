'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <Image
          src="/home-banner.jpg"
          alt="首页Banner"
          width={1200}
          height={500}
          style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'cover' }}
          priority
        />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(24px, 5vw, 48px)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            marginBottom: '20px'
          }}>
            陪有所术，诊无所忧
          </h1>
          <Link href="/main" className="btn" style={{
            fontSize: '18px',
            padding: '14px 40px'
          }}>
            开始学习
          </Link>
        </div>
      </div>
    </div>
  )
}
