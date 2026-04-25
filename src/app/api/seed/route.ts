export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const courses = [
  { id: 'course-1', title: '陪诊服务概述', description: '了解陪诊服务的基本概念和职业素养', cover_image: '/course-1.jpg', duration: 120, order_index: 1, is_required: true },
  { id: 'course-2', title: '服务流程', description: '掌握陪诊服务的标准工作流程', cover_image: '/course-2.jpg', duration: 150, order_index: 2, is_required: true },
  { id: 'course-3', title: '医疗常识', description: '学习常见疾病的症状和就医流程', cover_image: '/course-3.jpg', duration: 180, order_index: 3, is_required: true },
  { id: 'course-4', title: '法律法规', description: '了解陪诊服务的法律规范和责任', cover_image: '/course-4.jpg', duration: 120, order_index: 4, is_required: true },
  { id: 'course-5', title: '急救技能', description: '掌握基本的急救技能和应急处理', cover_image: '/course-5.jpg', duration: 150, order_index: 5, is_required: true },
  { id: 'course-6', title: '职业礼仪', description: '学习职业礼仪规范和服务标准', cover_image: '/course-6.jpg', duration: 100, order_index: 6, is_required: true },
]

const chaptersData = [
  { id: 'ch1-1', course_id: 'course-1', title: '什么是陪诊服务', content: '<h2>什么是陪诊服务</h2><p>陪诊服务是为患者提供就医陪伴和辅助的非医疗性服务。</p>', duration: 30, order_index: 1 },
  { id: 'ch1-2', course_id: 'course-1', title: '陪诊服务的发展历程', content: '<h2>陪诊服务的发展历程</h2><p>陪诊服务从无到有，经历了快速发展。</p>', duration: 25, order_index: 2 },
  { id: 'ch1-3', course_id: 'course-1', title: '陪诊师的职业素养', content: '<h2>陪诊师的职业素养</h2><p>合格的陪诊师需要具备多方面的职业素养。</p>', duration: 30, order_index: 3 },
  { id: 'ch1-4', course_id: 'course-1', title: '陪诊服务的职业前景', content: '<h2>陪诊服务的职业前景</h2><p>陪诊服务是一个朝阳行业，前景广阔。</p>', duration: 25, order_index: 4 },
  { id: 'ch2-1', course_id: 'course-2', title: '接单与确认', content: '<h2>接单与确认</h2><p>陪诊服务的第一步是接单和确认患者信息。</p>', duration: 30, order_index: 1 },
  { id: 'ch2-2', course_id: 'course-2', title: '诊前准备工作', content: '<h2>诊前准备工作</h2><p>充分的准备工作是优质服务的保障。</p>', duration: 35, order_index: 2 },
  { id: 'ch2-3', course_id: 'course-2', title: '陪诊服务执行', content: '<h2>陪诊服务执行</h2><p>按照标准流程完成陪诊服务。</p>', duration: 45, order_index: 3 },
  { id: 'ch2-4', course_id: 'course-2', title: '诊后跟进与回访', content: '<h2>诊后跟进与回访</h2><p>优质的服务体现在诊后的持续关怀。</p>', duration: 30, order_index: 4 },
  { id: 'ch3-1', course_id: 'course-3', title: '常见症状识别', content: '<h2>常见症状识别</h2><p>陪诊师需要了解常见症状，以便更好地协助患者。</p>', duration: 35, order_index: 1 },
  { id: 'ch3-2', course_id: 'course-3', title: '医院科室设置', content: '<h2>医院科室设置</h2><p>了解医院科室设置有助于准确分诊。</p>', duration: 30, order_index: 2 },
  { id: 'ch3-3', course_id: 'course-3', title: '常见检查项目', content: '<h2>常见检查项目</h2><p>了解常见检查项目有助于陪同患者顺利完成检查。</p>', duration: 35, order_index: 3 },
  { id: 'ch3-4', course_id: 'course-3', title: '用药基本知识', content: '<h2>用药基本知识</h2><p>了解基本用药知识，帮助患者安全用药。</p>', duration: 30, order_index: 4 },
  { id: 'ch4-1', course_id: 'course-4', title: '陪诊服务法规', content: '<h2>陪诊服务法规</h2><p>陪诊服务需要遵守相关法律法规。</p>', duration: 25, order_index: 1 },
  { id: 'ch4-2', course_id: 'course-4', title: '患者权益保护', content: '<h2>患者权益保护</h2><p>尊重和保护患者权益是陪诊师的基本职责。</p>', duration: 25, order_index: 2 },
  { id: 'ch4-3', course_id: 'course-4', title: '隐私保密规定', content: '<h2>隐私保密规定</h2><p>保护患者隐私是陪诊师的法定义务。</p>', duration: 20, order_index: 3 },
  { id: 'ch4-4', course_id: 'course-4', title: '服务责任划分', content: '<h2>服务责任划分</h2><p>明确责任边界，避免纠纷。</p>', duration: 20, order_index: 4 },
  { id: 'ch5-1', course_id: 'course-5', title: '心肺复苏术', content: '<h2>心肺复苏术（CPR）</h2><p>心肺复苏是抢救心跳骤停患者的关键技能。</p>', duration: 35, order_index: 1 },
  { id: 'ch5-2', course_id: 'course-5', title: '止血与包扎', content: '<h2>止血与包扎</h2><p>外伤出血的紧急处理技能。</p>', duration: 30, order_index: 2 },
  { id: 'ch5-3', course_id: 'course-5', title: '烫伤处理', content: '<h2>烫伤处理</h2><p>烫伤是常见意外，需要正确处理。</p>', duration: 25, order_index: 3 },
  { id: 'ch5-4', course_id: 'course-5', title: '急救原则', content: '<h2>急救基本原则</h2><p>急救时需要遵循的基本原则。</p>', duration: 30, order_index: 4 },
  { id: 'ch6-1', course_id: 'course-6', title: '仪容仪表', content: '<h2>仪容仪表规范</h2><p>良好的形象是专业服务的体现。</p>', duration: 20, order_index: 1 },
  { id: 'ch6-2', course_id: 'course-6', title: '着装规范', content: '<h2>着装规范</h2><p>统一规范的着装体现专业形象。</p>', duration: 20, order_index: 2 },
  { id: 'ch6-3', course_id: 'course-6', title: '沟通技巧', content: '<h2>沟通技巧</h2><p>良好的沟通是优质服务的基础。</p>', duration: 30, order_index: 3 },
  { id: 'ch6-4', course_id: 'course-6', title: '服务规范', content: '<h2>服务规范</h2><p>标准化服务流程体现专业水平。</p>', duration: 25, order_index: 4 },
]

const questionsData = [
  { id: 'q1-1', course_id: 'course-1', type: 'single', question: '陪诊服务的主要特点是什么？', options: ['A. 医疗性服务', 'B. 非医疗性服务', 'C. 诊疗服务', 'D. 手术服务'], correct_answer: 'B', explanation: '陪诊服务是非医疗性的辅助服务，主要提供导诊和陪伴。', difficulty: 1 },
  { id: 'q1-2', course_id: 'course-1', type: 'single', question: '陪诊师需要具备的首要素质是？', options: ['A. 医学知识', 'B. 职业道德', 'C. 驾驶技能', 'D. 烹饪技能'], correct_answer: 'B', explanation: '职业道德是陪诊师的首要素质。', difficulty: 1 },
  { id: 'q1-3', course_id: 'course-1', type: 'judgment', question: '陪诊师可以代替患者签署医疗文件。', options: ['A. 正确', 'B. 错误'], correct_answer: 'B', explanation: '医疗文件必须由患者本人或法定代理人签署。', difficulty: 2 },
  { id: 'q1-4', course_id: 'course-1', type: 'multiple', question: '陪诊师应具备的职业素养包括？', options: ['A. 诚实守信', 'B. 保护隐私', 'C. 尊重患者', 'D. 一切听患者指挥'], correct_answer: 'ABC', explanation: '陪诊师应具备职业道德、服务意识和专业知识。', difficulty: 2 },
  { id: 'q2-1', course_id: 'course-2', type: 'single', question: '接单后首先应该做什么？', options: ['A. 直接去医院', 'B. 核实患者基本信息', 'C. 给患者打电话聊天', 'D. 开始计费'], correct_answer: 'B', explanation: '接单后应核实患者基本信息。', difficulty: 1 },
  { id: 'q2-2', course_id: 'course-2', type: 'single', question: '陪诊服务结束后应在多长时间内回访？', options: ['A. 1小时内', 'B. 24小时内', 'C. 3天内', 'D. 一周内'], correct_answer: 'B', explanation: '应在24小时内进行电话回访。', difficulty: 2 },
  { id: 'q2-3', course_id: 'course-2', type: 'judgment', question: '陪诊师可以代替患者签署知情同意书。', options: ['A. 正确', 'B. 错误'], correct_answer: 'B', explanation: '知情同意书必须由患者本人或法定监护人签署。', difficulty: 2 },
  { id: 'q2-4', course_id: 'course-2', type: 'multiple', question: '诊前准备包括哪些内容？', options: ['A. 核实患者信息', 'B. 了解就诊医院和科室', 'C. 规划路线', 'D. 准备患者病历资料'], correct_answer: 'ABCD', explanation: '诊前准备包括核实信息、了解医院科室、规划路线、准备资料等。', difficulty: 2 },
  { id: 'q3-1', course_id: 'course-3', type: 'single', question: '正常人体体温范围是？', options: ['A. 35-36℃', 'B. 36-37℃', 'C. 37-38℃', 'D. 38-39℃'], correct_answer: 'B', explanation: '正常体温范围是36-37℃。', difficulty: 1 },
  { id: 'q3-2', course_id: 'course-3', type: 'single', question: '心内科主要治疗哪种疾病？', options: ['A. 肺炎', 'B. 心脏病', 'C. 胃炎', 'D. 糖尿病'], correct_answer: 'B', explanation: '心内科主要治疗心脏和血管相关疾病。', difficulty: 1 },
  { id: 'q3-3', course_id: 'course-3', type: 'judgment', question: 'B超检查有辐射。', options: ['A. 正确', 'B. 错误'], correct_answer: 'B', explanation: 'B超检查是利用超声波成像，没有辐射。', difficulty: 2 },
  { id: 'q3-4', course_id: 'course-3', type: 'multiple', question: '用药注意事项包括？', options: ['A. 按时服药', 'B. 注意服药方法', 'C. 了解不良反应', 'D. 可以自行停药'], correct_answer: 'ABC', explanation: '用药应遵医嘱按时服用，不可自行停药。', difficulty: 2 },
  { id: 'q4-1', course_id: 'course-4', type: 'single', question: '陪诊师可以从事医疗诊疗活动吗？', options: ['A. 可以', 'B. 不可以', 'C. 经过培训后可以', 'D. 看情况'], correct_answer: 'B', explanation: '陪诊师只能提供非医疗性的辅助服务。', difficulty: 1 },
  { id: 'q4-2', course_id: 'course-4', type: 'single', question: '患者的隐私信息包括？', options: ['A. 只有姓名', 'B. 只有病情', 'C. 身份信息、病情、治疗方案等', 'D. 都不保密'], correct_answer: 'C', explanation: '患者隐私包括身份信息、病情诊断、治疗方案等。', difficulty: 1 },
  { id: 'q4-3', course_id: 'course-4', type: 'judgment', question: '陪诊师可以在朋友圈分享患者就诊信息。', options: ['A. 正确', 'B. 错误'], correct_answer: 'B', explanation: '不得拍摄和传播患者信息，保护患者隐私。', difficulty: 1 },
  { id: 'q4-4', course_id: 'course-4', type: 'multiple', question: '患者的基本权利包括？', options: ['A. 知情权', 'B. 选择权', 'C. 隐私权', 'D. 强制医生开药权'], correct_answer: 'ABC', explanation: '患者有知情权、选择权、隐私权、受尊重权。', difficulty: 2 },
  { id: 'q5-1', course_id: 'course-5', type: 'single', question: '胸外按压的正确位置是？', options: ['A. 头部', 'B. 腹部', 'C. 两乳头连线中点', 'D. 背部'], correct_answer: 'C', explanation: '胸外按压应在两乳头连线中点进行。', difficulty: 1 },
  { id: 'q5-2', course_id: 'course-5', type: 'single', question: '成人心肺复苏按压深度应为多少厘米？', options: ['A. 2-3厘米', 'B. 4-5厘米', 'C. 5-6厘米', 'D. 8-10厘米'], correct_answer: 'C', explanation: '成人心肺复苏按压深度应为5-6厘米。', difficulty: 2 },
  { id: 'q5-3', course_id: 'course-5', type: 'judgment', question: '发现烫伤应立即用冷水冲洗15-20分钟。', options: ['A. 正确', 'B. 错误'], correct_answer: 'A', explanation: '烫伤后应立即用冷水冲洗15-20分钟。', difficulty: 1 },
  { id: 'q5-4', course_id: 'course-5', type: 'multiple', question: '急救的基本原则包括？', options: ['A. 安全第一', 'B. 快速评估', 'C. 及时呼救', 'D. 擅自用药'], correct_answer: 'ABC', explanation: '急救原则是安全第一、快速评估、及时呼救。', difficulty: 2 },
  { id: 'q6-1', course_id: 'course-6', type: 'single', question: '陪诊师的着装要求是？', options: ['A. 颜色鲜艳的运动服', 'B. 整洁得体的职业装', 'C. 便装即可', 'D. 医院白大褂'], correct_answer: 'B', explanation: '陪诊师应穿着整洁、得体的职业装或服务装。', difficulty: 1 },
  { id: 'q6-2', course_id: 'course-6', type: 'single', question: '以下哪项是服务禁用语？', options: ['A. 请稍等', 'B. 不知道', 'C. 我帮您查一下', 'D. 祝您早日康复'], correct_answer: 'B', explanation: '"不知道"是服务禁语。', difficulty: 1 },
  { id: 'q6-3', course_id: 'course-6', type: 'judgment', question: '陪诊服务过程中可以接打私人电话。', options: ['A. 正确', 'B. 错误'], correct_answer: 'B', explanation: '服务过程中应专注服务，不应接打私人电话。', difficulty: 1 },
  { id: 'q6-4', course_id: 'course-6', type: 'multiple', question: '与患者沟通时应做到？', options: ['A. 专注倾听', 'B. 适时回应', 'C. 记录关键信息', 'D. 随意打断对方'], correct_answer: 'ABC', explanation: '沟通时应专注倾听、适时回应、记录关键信息。', difficulty: 2 },
]

export async function POST(request: NextRequest) {
  try {
    // 先清空现有数据
    await getSupabase().from('learning_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await getSupabase().from('exam_records').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await getSupabase().from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await getSupabase().from('chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await getSupabase().from('certificates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await getSupabase().from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // 插入课程
    const { error: coursesError } = await getSupabase().from('courses').insert(courses)
    if (coursesError) {
      console.error('Courses error:', coursesError)
      return NextResponse.json({ success: false, error: '插入课程失败' }, { status: 500 })
    }

    // 插入章节
    const { error: chaptersError } = await getSupabase().from('chapters').insert(chaptersData)
    if (chaptersError) {
      console.error('Chapters error:', chaptersError)
      return NextResponse.json({ success: false, error: '插入章节失败' }, { status: 500 })
    }

    // 插入题库
    const { error: questionsError } = await getSupabase().from('questions').insert(questionsData)
    if (questionsError) {
      console.error('Questions error:', questionsError)
      return NextResponse.json({ success: false, error: '插入题库失败' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '初始化成功',
      courses: courses.length,
      chapters: chaptersData.length,
      questions: questionsData.length
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: '初始化失败' }, { status: 500 })
  }
}
