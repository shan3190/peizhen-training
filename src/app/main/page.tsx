'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  id: string
  name: string
  phone: string
}

const courses = [
  { id: 1, title: '陪诊服务概述', image: '/course-1.jpg' },
  { id: 2, title: '服务流程', image: '/course-2.jpg' },
  { id: 3, title: '医疗常识', image: '/course-3.jpg' },
  { id: 4, title: '法律法规', image: '/course-4.jpg' },
  { id: 5, title: '急救技能', image: '/course-5.jpg' },
  { id: 6, title: '职业礼仪', image: '/course-6.jpg' },
]

export default function MainPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('peizhen_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('peizhen_user')
    setUser(null)
  }

  return (
    <div style={{ background: '#f0f4ff', minHeight: '100vh' }}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="logo" />
          <span className="brand">陪诊通</span>
          {user && (
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              欢迎，{user.name || user.phone}
            </span>
          )}
        </div>
        <div className="header-right">
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline">
              退出
            </button>
          ) : (
            <>
              <Link href="/login?type=register" className="btn btn-outline">
                注册
              </Link>
              <Link href="/login" className="btn">
                登录
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Top Images */}
      <Image
        src="/header-top.jpg"
        alt="顶部装饰"
        width={1200}
        height={200}
        style={{ width: '100%', height: 'auto' }}
      />
      <Image
        src="/header-bg.jpg"
        alt="主体背景"
        width={1200}
        height={300}
        style={{ width: '100%', height: 'auto' }}
      />

      {/* Courses Section */}
      <div className="section">
        <h2 className="section-title">培训课程</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <Link href={`/course/${course.id}`} key={course.id} style={{ textDecoration: 'none' }}>
              <div className="course-card">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={300}
                  height={160}
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
                <div style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ color: '#1e40af', fontWeight: 600 }}>{course.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="divider" style={{ maxWidth: '800px', margin: '0 auto' }} />

      {/* Exam Section */}
      <div className="section">
        <h2 className="section-title">题库和结业考试</h2>
        <div className="two-col">
          <Image
            src="/exam-bank.jpg"
            alt="题库"
            width={400}
            height={200}
            style={{ width: '100%', borderRadius: '12px' }}
          />
          <Image
            src="/graduation-exam.jpg"
            alt="结业考试"
            width={400}
            height={200}
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </div>
      </div>

      {/* Footer */}
      <Image
        src="/footer-bg.jpg"
        alt="底部"
        width={1200}
        height={200}
        className="footer-img"
      />
    </div>
  )
}
