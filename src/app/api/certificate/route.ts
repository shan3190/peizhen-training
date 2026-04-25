import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// 获取证书信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const { data: certificate, error } = await getSupabase()
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ success: false, error: '获取证书失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificate: certificate || null
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取证书失败' }, { status: 500 })
  }
}

// 领取证书
export async function POST(request: NextRequest) {
  try {
    const { userId, name, idCard } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    // 检查是否已领取证书
    const { data: existing } = await getSupabase()
      .from('certificates')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existing) {
      return NextResponse.json({ success: false, error: '您已领取过证书' }, { status: 400 })
    }

    // 生成证书编号
    const certificateNo = `ZZPZT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const { data: certificate, error } = await getSupabase()
      .from('certificates')
      .insert({
        user_id: userId,
        certificate_no: certificateNo,
        name,
        id_card: idCard,
        issue_date: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: '领取证书失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificate
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '领取证书失败' }, { status: 500 })
  }
}
