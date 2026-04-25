import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// 开始考试 - 获取题目
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    // 检查是否完成所有课程
    const { data: progress } = await getSupabase()
      .from('learning_progress')
      .select('course_id, is_completed')
      .eq('user_id', userId)
      .eq('is_completed', true)

    const completedCourses = new Set(progress?.map(p => p.course_id) || [])
    const requiredCourses = ['course-1', 'course-2', 'course-3', 'course-4', 'course-5', 'course-6']

    const allCompleted = requiredCourses.every(courseId => completedCourses.has(courseId))

    if (!allCompleted) {
      return NextResponse.json({ 
        success: false, 
        error: '请先完成所有课程学习',
        completedCourses: Array.from(completedCourses)
      }, { status: 400 })
    }

    // 检查考试次数
    const { data: examRecord } = await getSupabase()
      .from('exam_records')
      .select('exam_count')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const examCount = examRecord?.exam_count || 0

    if (examCount >= 5) {
      return NextResponse.json({ 
        success: false, 
        error: '您已完成5次考试，请联系管理员' 
      }, { status: 400 })
    }

    // 获取所有题目
    const { data: questions, error } = await getSupabase()
      .from('questions')
      .select('*')

    if (error) {
      return NextResponse.json({ success: false, error: '获取题目失败' }, { status: 500 })
    }

    // 随机抽取50道题
    const shuffled = [...(questions || [])].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, 50).map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options
    }))

    return NextResponse.json({
      success: true,
      questions: selectedQuestions,
      examCount: examCount + 1
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '开始考试失败' }, { status: 500 })
  }
}

// 提交考试答案
export async function PUT(request: NextRequest) {
  try {
    const { userId, questionIds, answers, score, correctCount, isPassed } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    // 获取之前的考试次数
    const { data: lastExam } = await getSupabase()
      .from('exam_records')
      .select('exam_count')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const examCount = (lastExam?.exam_count || 0) + 1

    const { data, error } = await getSupabase()
      .from('exam_records')
      .insert({
        user_id: userId,
        score,
        total_questions: questionIds.length,
        correct_count: correctCount,
        is_passed: isPassed,
        question_ids: JSON.stringify(questionIds),
        answers: JSON.stringify(answers),
        exam_count: examCount
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: '保存考试结果失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      examRecord: data,
      message: isPassed ? '恭喜您通过了考试！' : '未通过考试，请继续学习后再试'
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '提交考试失败' }, { status: 500 })
  }
}

// 获取考试记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const { data: records, error } = await getSupabase()
      .from('exam_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: '获取考试记录失败' }, { status: 500 })
    }

    const passed = records?.find(r => r.is_passed)
    
    return NextResponse.json({
      success: true,
      records: records || [],
      hasPassed: !!passed,
      bestScore: records ? Math.max(...records.map(r => r.score)) : 0
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取考试记录失败' }, { status: 500 })
  }
}
