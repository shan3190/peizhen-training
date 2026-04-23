import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { phone, password, name } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: '请输入手机号和密码' }, { status: 400 });
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '请输入正确的手机号' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: '数据库未配置' }, { status: 500 });
    }

    // 检查手机号是否已注册
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existing) {
      return NextResponse.json({ error: '该手机号已注册' }, { status: 400 });
    }

    // 创建用户
    const { data: user, error } = await supabase
      .from('users')
      .insert({ phone, password, name })
      .select()
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '注册失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
