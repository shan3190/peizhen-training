export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await getSupabase()
      .from('courses')
      .select('*')
      .order('order_index')

    if (error) {
      return NextResponse.json({ success: false, error: '获取课程失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, courses: data || [] })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取课程失败' }, { status: 500 })
  }
}
