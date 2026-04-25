export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { phone, password, name } = await request.json()

    if (!phone || !password) {
      return NextResponse.json({ success: false, error: '请填写所有必填项' }, { status: 400 })
    }

    // 检查手机号是否已存在
    const { data: existing } = await getSupabase()
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single()

    if (existing) {
      return NextResponse.json({ success: false, error: '该手机号已注册' }, { status: 400 })
    }

    // 创建用户
    const { data, error } = await getSupabase()
      .from('users')
      .insert({ phone, password, name: name || '' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: '注册失败' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: data.id, phone: data.phone, name: data.name } 
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '注册失败' }, { status: 500 })
  }
}
