import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    const userId = request.headers.get('x-user-id');

    // 获取课程信息
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: '课程不存在' }, { status: 404 });
    }

    // 获取章节列表
    const { data: chapters } = await supabase
      .from('chapters')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    // 如果用户已登录，获取学习进度
    let completedChapters: string[] = [];
    if (userId) {
      const { data: progresses } = await supabase
        .from('learning_progress')
        .select('chapter_id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('is_completed', true);

      completedChapters = progresses?.map(p => p.chapter_id) || [];
    }

    // 添加进度信息到章节
    const chaptersWithProgress = chapters?.map(ch => ({
      ...ch,
      is_completed: completedChapters.includes(ch.id)
    })) || [];

    return NextResponse.json({
      success: true,
      course,
      chapters: chaptersWithProgress
    });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json({ error: '获取课程详情失败' }, { status: 500 });
  }
}
