export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: course, error: courseError } = await getSupabase()
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ success: false, error: '课程不存在' }, { status: 404 })
    }

    const { data: chapters, error: chaptersError } = await getSupabase()
      .from('chapters')
      .select('*')
      .eq('course_id', id)
      .order('order_index')

    return NextResponse.json({ 
      success: true, 
      course,
      chapters: chapters || [] 
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取课程失败' }, { status: 500 })
  }
}
