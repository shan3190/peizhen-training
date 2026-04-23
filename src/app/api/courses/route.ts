import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json({ error: '获取课程列表失败' }, { status: 500 });
    }

    // 如果用户已登录，获取学习进度
    let progressMap: Record<string, { completed: number; total: number }> = {};

    if (userId) {
      const { data: progresses } = await supabase
        .from('learning_progress')
        .select('course_id, chapter_id')
        .eq('user_id', userId)
        .eq('is_completed', true);

      if (progresses) {
        for (const p of progresses) {
          if (!progressMap[p.course_id]) {
            progressMap[p.course_id] = { completed: 0, total: 0 };
          }
          progressMap[p.course_id].completed++;
        }
      }

      // 获取每个课程的总章节数
      const { data: chapters } = await supabase
        .from('chapters')
        .select('course_id');

      for (const ch of chapters || []) {
        if (!progressMap[ch.course_id]) {
          progressMap[ch.course_id] = { completed: 0, total: 0 };
        }
        progressMap[ch.course_id].total++;
      }
    }

    // 合并数据
    const coursesWithProgress = courses?.map(course => ({
      ...course,
      progress: progressMap[course.id] || { completed: 0, total: 0 }
    })) || [];

    return NextResponse.json({ success: true, courses: coursesWithProgress });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json({ error: '获取课程列表失败' }, { status: 500 });
  }
}
