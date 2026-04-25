'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Chapter {
  id: number
  title: string
  order_index: number
}

interface Course {
  id: number
  title: string
  description: string
}

interface Progress {
  chapter_id: number
  is_completed: boolean
}

const courseNames: Record<number, string> = {
  1: '陪诊服务概述',
  2: '服务流程',
  3: '医疗常识',
  4: '法律法规',
  5: '急救技能',
  6: '职业礼仪',
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = Number(params.id)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const courseName = courseNames[courseId] || '课程'

  useEffect(() => {
    const userData = localStorage.getItem('peizhen_user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    
    fetchChapters()
    fetchProgress()
  }, [courseId])

  const fetchChapters = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`)
      const data = await res.json()
      if (data.success) {
        setChapters(data.chapters || [])
      }
    } catch (error) {
      console.error('获取章节失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('peizhen_user') || '{}')
      const res = await fetch(`/api/progress?userId=${userData.id}&courseId=${courseId}`)
      const data = await res.json()
      if (data.success) {
        setProgress(data.progress || [])
      }
    } catch (error) {
      console.error('获取进度失败:', error)
    }
  }

  const handleChapterClick = async (chapterId: number) => {
    const userData = JSON.parse(localStorage.getItem('peizhen_user') || '{}')
    
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          courseId,
          chapterId,
        }),
      })
      fetchProgress()
    } catch (error) {
      console.error('更新进度失败:', error)
    }
  }

  const isChapterCompleted = (chapterId: number) => {
    return progress.some(p => p.chapter_id === chapterId && p.is_completed)
  }

  const completedCount = progress.filter(p => p.is_completed).length
  const progressPercent = chapters.length > 0 
    ? Math.round((completedCount / chapters.length) * 100) 
    : 0

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <Link href="/main" style={{ fontSize: '20px', color: '#1e40af' }}>←</Link>
          <span style={{ fontWeight: 600 }}>{courseName}</span>
        </div>
      </div>

      <div className="content">
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>{courseName}</h1>
        
        {/* Progress */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280' }}>学习进度</span>
            <span style={{ color: '#1e40af', fontWeight: 600 }}>{completedCount}/{chapters.length} 章节</span>
          </div>
          <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px' }}>
            <div 
              style={{ 
                background: '#1e40af', 
                height: '100%', 
                borderRadius: '4px',
                width: `${progressPercent}%`,
                transition: 'width 0.3s'
              }} 
            />
          </div>
        </div>

        {/* Chapters */}
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>课程章节</h2>
        {loading ? (
          <p style={{ color: '#6b7280' }}>加载中...</p>
        ) : chapters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>暂无章节内容</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>请联系管理员添加课程内容</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chapters.map((chapter) => (
              <div 
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                style={{ 
                  background: 'white', 
                  padding: '16px 20px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isChapterCompleted(chapter.id) ? '#10b981' : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isChapterCompleted(chapter.id) ? 'white' : '#6b7280',
                    fontSize: '14px'
                  }}>
                    {isChapterCompleted(chapter.id) ? '✓' : chapter.order_index}
                  </div>
                  <span style={{ fontWeight: 500 }}>{chapter.title}</span>
                </div>
                <span style={{ color: '#10b981', fontSize: '14px' }}>
                  {isChapterCompleted(chapter.id) ? '已完成' : '未完成'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
