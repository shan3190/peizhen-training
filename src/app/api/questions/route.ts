import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// 获取题库
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    let query = getSupabase().from('questions').select('*')
    
    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: '获取题库失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, questions: data || [] })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取题库失败' }, { status: 500 })
  }
}
