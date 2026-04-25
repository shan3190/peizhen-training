export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// 获取用户进度
export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    if (courseId) {
      // 获取特定课程进度
      const { data, error } = await getSupabase()
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)

      if (error) {
        return NextResponse.json({ success: false, error: '获取进度失败' }, { status: 500 })
      }

      // 获取课程章节数
      const { data: chapters } = await getSupabase()
        .from('chapters')
        .select('id')
        .eq('course_id', courseId)

      const completedCount = data?.filter(p => p.is_completed).length || 0
      const totalChapters = chapters?.length || 0

      return NextResponse.json({
        success: true,
        progress: data,
        completedCount,
        totalChapters,
        percentage: totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0
      })
    } else {
      // 获取所有课程进度
      const { data, error } = await getSupabase()
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        return NextResponse.json({ success: false, error: '获取进度失败' }, { status: 500 })
      }

      return NextResponse.json({ success: true, progress: data || [] })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取进度失败' }, { status: 500 })
  }
}

// 完成章节
export async function PUT(request: NextRequest) {
  try {
    const { userId, courseId, chapterId } = await request.json()

    if (!userId || !courseId || !chapterId) {
      return NextResponse.json({ success: false, error: '参数不完整' }, { status: 400 })
    }

    // 检查是否已记录
    const { data: existing } = await getSupabase()
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('chapter_id', chapterId)
      .single()

    if (existing) {
      // 更新为已完成
      const { data, error } = await getSupabase()
        .from('learning_progress')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ success: false, error: '更新进度失败' }, { status: 500 })
      }

      return NextResponse.json({ success: true, progress: data })
    } else {
      // 创建新记录
      const { data, error } = await getSupabase()
        .from('learning_progress')
        .insert({
          user_id: userId,
          course_id: courseId,
          chapter_id: chapterId,
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ success: false, error: '保存进度失败' }, { status: 500 })
      }

      return NextResponse.json({ success: true, progress: data })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: '保存进度失败' }, { status: 500 })
  }
}
