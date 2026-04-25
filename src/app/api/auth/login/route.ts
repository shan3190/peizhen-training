export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json({ success: false, error: '请输入手机号和密码' }, { status: 400 })
    }

    const { data, error } = await getSupabase()
      .from('users')
      .select('*')
      .eq('phone', phone)
      .eq('password', password)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: '手机号或密码错误' }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: data.id, phone: data.phone, name: data.name } 
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '登录失败' }, { status: 500 })
  }
}
