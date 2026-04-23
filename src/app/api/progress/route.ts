import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 获取用户学习进度
export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { course_id, chapter_id, is_completed } = await request.json();

    if (is_completed) {
      // 记录学习进度
      const { data, error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: userId,
          course_id,
          chapter_id,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,chapter_id'
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: '记录学习进度失败' }, { status: 500 });
      }

      return NextResponse.json({ success: true, progress: data });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json({ error: '记录学习进度失败' }, { status: 500 });
  }
}

// 获取用户所有学习进度
export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { data: progresses } = await supabase
      .from('learning_progress')
      .select('course_id, chapter_id, is_completed, completed_at')
      .eq('user_id', userId);

    return NextResponse.json({ success: true, progresses: progresses || [] });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: '获取学习进度失败' }, { status: 500 });
  }
}
