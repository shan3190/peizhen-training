import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    const client = supabase;

    // 清空现有数据
    try {
      await client.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await client.from('chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await client.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) { /* ignore */ }

    // 1. 创建课程
    const courses = [
      {
        id: 'c001',
        title: '陪诊服务概述',
        description: '了解陪诊服务的定义、发展历程、服务范围及职业前景',
        duration: 120,
        order_index: 1,
        is_required: true
      },
      {
        id: 'c002',
        title: '职业礼仪',
        description: '掌握陪诊师职业礼仪规范，包括仪容仪表、沟通技巧、服务意识',
        duration: 90,
        order_index: 2,
        is_required: true
      },
      {
        id: 'c003',
        title: '服务流程',
        description: '学习陪诊服务标准化流程，从接单到回访的完整服务闭环',
        duration: 150,
        order_index: 3,
        is_required: true
      },
      {
        id: 'c004',
        title: '医疗常识',
        description: '了解常见疾病症状、医院科室分布、检查检验项目解读',
        duration: 180,
        order_index: 4,
        is_required: true
      },
      {
        id: 'c005',
        title: '急救技能',
        description: '掌握基础急救知识和技能，包括心肺复苏、止血包扎、应急处理',
        duration: 120,
        order_index: 5,
        is_required: true
      },
      {
        id: 'c006',
        title: '法律法规',
        description: '了解陪诊服务相关法律法规、患者权益保护、隐私保密规定',
        duration: 90,
        order_index: 6,
        is_required: true
      }
    ];

    for (const course of courses) {
      await client.from('courses').upsert(course);
    }

    // 2. 创建章节
    const chapters = [
      // 课程1：陪诊服务概述
      { id: 'ch001', course_id: 'c001', title: '什么是陪诊服务', content: `<h2>陪诊服务的定义</h2>
<p>陪诊服务是指专业人员为患者提供就医陪伴、导诊、协助等服务，帮助患者更高效、更便捷地完成就诊过程。</p>
<h3>服务对象</h3>
<ul>
<li>独自就医有困难的老人</li>
<li>行动不便的患者</li>
<li>异地就医的患者</li>
<li>工作繁忙的上班族</li>
<li>需要心理支持的患者</li>
</ul>
<h3>服务价值</h3>
<p>陪诊服务可以有效缓解患者就医难的问题，减少排队等待时间，提高就诊效率，同时为患者提供心理安慰和情感支持。</p>`, duration: 30, order_index: 1 },
      { id: 'ch002', course_id: 'c001', title: '陪诊服务的发展历程', content: `<h2>陪诊服务发展历程</h2>
<p>陪诊服务从最初的简单陪同就医，逐渐发展为专业化、规范化的服务体系。</p>
<h3>发展阶段</h3>
<ol>
<li><strong>萌芽期</strong>：2010年前后，部分医院出现志愿陪诊服务</li>
<li><strong>发展期</strong>：2015-2019年，专业陪诊机构开始出现</li>
<li><strong>成熟期</strong>：2020年至今，线上线下融合，服务标准化</li>
</ol>
<h3>行业现状</h3>
<p>目前陪诊服务已覆盖全国大部分城市，成为医疗服务体系的重要补充。</p>`, duration: 30, order_index: 2 },
      { id: 'ch003', course_id: 'c001', title: '陪诊师的职业素养', content: `<h2>陪诊师职业素养要求</h2>
<p>作为一名合格的陪诊师，需要具备以下职业素养：</p>
<ul>
<li><strong>职业道德</strong>：诚实守信、保护隐私、尊重患者</li>
<li><strong>服务意识</strong>：以患者为中心，提供贴心服务</li>
<li><strong>专业知识</strong>：了解医疗流程、医院环境、常见疾病</li>
<li><strong>沟通能力</strong>：善于与患者和医护人员沟通</li>
<li><strong>心理素质</strong>：能够应对各种突发情况和负面情绪</li>
</ul>`, duration: 30, order_index: 3 },
      { id: 'ch004', course_id: 'c001', title: '陪诊服务的职业前景', content: `<h2>陪诊服务行业前景</h2>
<p>随着人口老龄化加速和医疗服务需求增长，陪诊服务行业前景广阔。</p>
<h3>市场机遇</h3>
<ul>
<li>老龄化社会带来的巨大需求</li>
<li>独居人群增多</li>
<li>医疗资源分布不均</li>
<li>消费升级和服务意识提升</li>
</ul>
<h3>职业发展方向</h3>
<p>陪诊师可以向高级陪诊师、陪诊团队管理者、专业培训师等方向发展。</p>`, duration: 30, order_index: 4 },

      // 课程2：职业礼仪
      { id: 'ch005', course_id: 'c002', title: '仪容仪表规范', content: `<h2>陪诊师仪容仪表要求</h2>
<p>良好的仪容仪表是给患者和家属的第一印象。</p>
<h3>着装要求</h3>
<ul>
<li>穿着整洁、得体的职业装或服务装</li>
<li>颜色以蓝色、白色为主，体现专业感</li>
<li>佩戴统一的工作牌</li>
<li>鞋子干净舒适</li>
</ul>
<h3>仪容要求</h3>
<ul>
<li>头发整洁，不披头散发</li>
<li>面部清洁，表情自然</li>
<li>不浓妆艳抹</li>
<li>不佩戴夸张首饰</li>
</ul>`, duration: 25, order_index: 1 },
      { id: 'ch006', course_id: 'c002', title: '服务用语规范', content: `<h2>服务用语规范</h2>
<p>规范的语言表达是优质服务的关键。</p>
<h3>常用文明用语</h3>
<ul>
<li>"您好，请问有什么可以帮您？"</li>
<li>"请稍等，我帮您查询一下"</li>
<li>"您这边请，我带您去"</li>
<li>"祝您早日康复！"</li>
</ul>
<h3>服务禁语</h3>
<ul>
<li>"不知道"</li>
<li>"不行"</li>
<li>"你自己看着办"</li>
<li>"快点"</li>
</ul>`, duration: 25, order_index: 2 },
      { id: 'ch007', course_id: 'c002', title: '沟通技巧', content: `<h2>沟通技巧</h2>
<p>良好的沟通是服务的基础。</p>
<h3>沟通原则</h3>
<ul>
<li><strong>倾听</strong>：认真倾听患者需求，不随意打断</li>
<li><strong>表达</strong>：语言清晰、语速适中</li>
<li><strong>态度</strong>：热情耐心、态度诚恳</li>
<li><strong>尊重</strong>：尊重患者隐私和选择</li>
</ul>
<h3>特殊情况处理</h3>
<p>遇到患者情绪激动时，保持冷静，用温和的语气安抚。</p>`, duration: 20, order_index: 3 },
      { id: 'ch008', course_id: 'c002', title: '服务意识培养', content: `<h2>服务意识培养</h2>
<p>优质的服务源于主动的服务意识。</p>
<h3>主动服务</h3>
<ul>
<li>主动询问患者需求</li>
<li>预见患者可能需要的服务</li>
<li>及时提供帮助</li>
</ul>
<h3>服务态度</h3>
<ul>
<li>始终保持微笑</li>
<li>积极主动，不推诿</li>
<li>耐心解答疑问</li>
</ul>`, duration: 20, order_index: 4 },

      // 课程3：服务流程
      { id: 'ch009', course_id: 'c003', title: '接单与确认', content: `<h2>接单与确认</h2>
<p>服务从接单开始，确保信息准确无误。</p>
<h3>接单流程</h3>
<ul>
<li>接收订单信息</li>
<li>核实患者基本信息（姓名、联系方式）</li>
<li>确认就诊信息（医院、科室、时间）</li>
<li>评估服务需求</li>
</ul>
<h3>确认事项</h3>
<ul>
<li>患者病情描述</li>
<li>需要准备的资料</li>
<li>特殊需求（如轮椅）</li>
</ul>`, duration: 30, order_index: 1 },
      { id: 'ch010', course_id: 'c003', title: '诊前准备', content: `<h2>诊前准备</h2>
<p>充分的准备是服务成功的保障。</p>
<h3>信息准备</h3>
<ul>
<li>了解就诊医院和科室位置</li>
<li>规划最优路线</li>
<li>查询相关科室出诊信息</li>
</ul>
<h3>物品准备</h3>
<ul>
<li>患者病历资料</li>
<li>身份证、医保卡</li>
<li>之前的检查报告</li>
<li>轮椅（如有需要）</li>
</ul>`, duration: 30, order_index: 2 },
      { id: 'ch011', course_id: 'c003', title: '诊中服务', content: `<h2>诊中服务</h2>
<p>全程陪伴患者完成就诊。</p>
<h3>服务内容</h3>
<ul>
<li>引导患者到达诊室</li>
<li>协助挂号、候诊</li>
<li>陪同问诊、记录医嘱</li>
<li>协助检查、缴费</li>
<li>取药、预约复诊</li>
</ul>
<h3>注意事项</h3>
<p>尊重患者隐私，不代替患者签署任何文件。</p>`, duration: 45, order_index: 3 },
      { id: 'ch012', course_id: 'c003', title: '诊后回访', content: `<h2>诊后回访</h2>
<p>服务延伸，提升满意度。</p>
<h3>回访内容</h3>
<ul>
<li>了解患者恢复情况</li>
<li>提醒按时服药</li>
<li>解答疑问</li>
<li>收集服务反馈</li>
</ul>
<h3>回访时间</h3>
<p>一般在就诊后24小时内完成回访。</p>`, duration: 25, order_index: 4 },
      { id: 'ch013', course_id: 'c003', title: '服务流程图', content: `<h2>服务流程图</h2>
<p>标准化服务流程图：</p>
<ol>
<li><strong>接单</strong> → 接收订单，核实信息</li>
<li><strong>准备</strong> → 了解医院，准备物品</li>
<li><strong>到达</strong> → 准时到达患者处</li>
<li><strong>陪诊</strong> → 全程陪同就诊</li>
<li><strong>完成</strong> → 送别患者，记录总结</li>
<li><strong>回访</strong> → 24小时内回访</li>
</ol>`, duration: 20, order_index: 5 },

      // 课程4：医疗常识
      { id: 'ch014', course_id: 'c004', title: '常见症状识别', content: `<h2>常见症状识别</h2>
<p>了解常见症状，帮助患者准确描述病情。</p>
<h3>发热</h3>
<ul>
<li>正常体温：36-37℃</li>
<li>低热：37.3-38℃</li>
<li>中等热：38.1-39℃</li>
<li>高热：39.1-41℃</li>
</ul>
<h3>疼痛</h3>
<p>注意疼痛部位、性质、程度、持续时间。</p>`, duration: 35, order_index: 1 },
      { id: 'ch015', course_id: 'c004', title: '医院科室分布', content: `<h2>医院科室分布</h2>
<p>熟悉医院科室，提高导诊效率。</p>
<h3>内科系统</h3>
<ul>
<li>心内科：心脏病、高血压</li>
<li>呼吸内科：感冒、肺炎、哮喘</li>
<li>消化内科：胃炎、肠炎、肝病</li>
<li>神经内科：头痛、脑血管病</li>
</ul>
<h3>外科系统</h3>
<ul>
<li>普外科：阑尾炎、疝气</li>
<li>骨科：骨折、关节炎</li>
<li>神经外科：脑肿瘤、脑外伤</li>
</ul>`, duration: 35, order_index: 2 },
      { id: 'ch016', course_id: 'c004', title: '检查检验常识', content: `<h2>检查检验常识</h2>
<p>了解常见检查项目，协助患者做好准备。</p>
<h3>血液检查</h3>
<ul>
<li>一般需要空腹</li>
<li>抽血后按压5-10分钟</li>
</ul>
<h3>影像检查</h3>
<ul>
<li>B超：无辐射，无需特殊准备</li>
<li>CT：有辐射，摘除金属物品</li>
<li>MRI：无辐射，禁带金属物品</li>
</ul>`, duration: 35, order_index: 3 },
      { id: 'ch017', course_id: 'c004', title: '用药注意事项', content: `<h2>用药注意事项</h2>
<p>指导患者正确用药。</p>
<h3>用药原则</h3>
<ul>
<li>遵医嘱按时服药</li>
<li>注意服药方法（饭前/饭后）</li>
<li>了解不良反应</li>
<li>不自行停药</li>
</ul>
<h3>用药保存</h3>
<p>按照说明书要求保存，注意避光、阴凉处保存。</p>`, duration: 35, order_index: 4 },
      { id: 'ch018', course_id: 'c004', title: '常见疾病护理', content: `<h2>常见疾病护理</h2>
<p>了解常见疾病的护理要点。</p>
<h3>糖尿病</h3>
<ul>
<li>控制饮食</li>
<li>适量运动</li>
<li>定时监测血糖</li>
<li>按时服药/注射胰岛素</li>
</ul>
<h3>高血压</h3>
<ul>
<li>低盐饮食</li>
<li>情绪稳定</li>
<li>定期监测血压</li>
</ul>`, duration: 40, order_index: 5 },

      // 课程5：急救技能
      { id: 'ch019', course_id: 'c005', title: '急救基础知识', content: `<h2>急救基础知识</h2>
<p>掌握急救的基本原则。</p>
<h3>急救原则</h3>
<ul>
<li><strong>安全第一</strong>：确保现场安全</li>
<li><strong>快速评估</strong>：判断伤病情</li>
<li><strong>及时呼救</strong>：拨打120</li>
<li><strong>正确施救</strong>：不造成二次伤害</li>
</ul>`, duration: 25, order_index: 1 },
      { id: 'ch020', course_id: 'c005', title: '心肺复苏术', content: `<h2>心肺复苏术（CPR）</h2>
<p>心肺复苏是抢救心跳骤停患者的关键技能。</p>
<h3>操作步骤</h3>
<ol>
<li>判断意识，呼叫求助</li>
<li>判断呼吸和脉搏</li>
<li>胸外按压：两乳头连线中点，深度5-6cm</li>
<li>频率：100-120次/分钟</li>
<li>清理呼吸道，人工呼吸（如会）</li>
</ol>
<h3>注意事项</h3>
<p>按压与放松时间相等，尽量减少中断。</p>`, duration: 35, order_index: 2 },
      { id: 'ch021', course_id: 'c005', title: '止血与包扎', content: `<h2>止血与包扎</h2>
<p>出血处理的常用方法。</p>
<h3>止血方法</h3>
<ul>
<li><strong>直接压迫</strong>：用干净纱布直接按压伤口</li>
<li><strong>加压包扎</strong>：绷带加压缠绕</li>
<li><strong>抬高患肢</strong>：减少出血</li>
</ul>
<h3>包扎要求</h3>
<ul>
<li>动作轻柔</li>
<li>松紧适度</li>
<li>美观牢固</li>
</ul>`, duration: 30, order_index: 3 },
      { id: 'ch022', course_id: 'c005', title: '常见意外处理', content: `<h2>常见意外处理</h2>
<p>烫伤、扭伤、骨折等常见意外的处理。</p>
<h3>烫伤</h3>
<ul>
<li>冷水冲洗15-20分钟</li>
<li>剪开衣物</li>
<li>涂抹烫伤膏</li>
<li>就医（严重时）</li>
</ul>
<h3>扭伤</h3>
<ul>
<li>RICE原则：休息、冰敷、加压、抬高</li>
</ul>`, duration: 30, order_index: 4 },

      // 课程6：法律法规
      { id: 'ch023', course_id: 'c006', title: '陪诊服务法规', content: `<h2>陪诊服务法规</h2>
<p>了解陪诊服务的法律边界。</p>
<h3>服务边界</h3>
<ul>
<li>陪诊师<strong>不能</strong>从事医疗诊疗活动</li>
<li>陪诊师<strong>不能</strong>代替患者签署知情同意书</li>
<li>陪诊师<strong>不能</strong>代替患者做医疗决策</li>
<li>陪诊师<strong>可以</strong>提供导诊、陪同、协助服务</li>
</ul>`, duration: 25, order_index: 1 },
      { id: 'ch024', course_id: 'c006', title: '患者权益保护', content: `<h2>患者权益保护</h2>
<p>尊重和保护患者合法权益。</p>
<h3>患者基本权利</h3>
<ul>
<li><strong>知情权</strong>：了解病情、治疗方案</li>
<li><strong>选择权</strong>：选择医院、医生</li>
<li><strong>隐私权</strong>：个人信息保密</li>
<li><strong>受尊重权</strong>：人格尊严不受侵犯</li>
</ul>`, duration: 25, order_index: 2 },
      { id: 'ch025', course_id: 'c006', title: '隐私保密规定', content: `<h2>隐私保密规定</h2>
<p>严格保护患者隐私。</p>
<h3>保密内容</h3>
<ul>
<li>患者身份信息</li>
<li>病情诊断</li>
<li>治疗方案</li>
<li>检查结果</li>
</ul>
<h3>保密要求</h3>
<ul>
<li>不拍摄患者照片</li>
<li>不传播患者信息</li>
<li>不与无关人员讨论</li>
</ul>`, duration: 20, order_index: 3 },
      { id: 'ch026', course_id: 'c006', title: '纠纷预防与处理', content: `<h2>纠纷预防与处理</h2>
<p>预防和妥善处理服务纠纷。</p>
<h3>预防措施</h3>
<ul>
<li>规范服务流程</li>
<li>保留服务记录</li>
<li>及时沟通反馈</li>
</ul>
<h3>处理原则</h3>
<ul>
<li>保持冷静</li>
<li>耐心倾听</li>
<li>积极协商</li>
<li>寻求帮助</li>
</ul>`, duration: 20, order_index: 4 }
    ];

    for (const chapter of chapters) {
      await client.from('chapters').upsert(chapter);
    }

    // 3. 创建题库（每门课4题，共24题）
    const questions = [
      // 课程1：陪诊服务概述
      { id: 'q001', course_id: 'c001', type: 'single', question: '陪诊服务的主要服务对象不包括？', options: JSON.stringify(['A. 独自就医有困难的老人', 'B. 行动不便的患者', 'C. 所有来医院就诊的人', 'D. 异地就医的患者']), correct_answer: 'C', explanation: '陪诊服务主要针对有特殊需求的患者，不是所有就诊者。', difficulty: 1 },
      { id: 'q002', course_id: 'c001', type: 'single', question: '陪诊服务的核心价值是？', options: JSON.stringify(['A. 增加医院收入', 'B. 缓解患者就医难，提高就诊效率', 'C. 减少医生工作量', 'D. 推广医院品牌']), correct_answer: 'B', explanation: '陪诊服务的核心价值在于帮助患者更高效、便捷地完成就诊。', difficulty: 1 },
      { id: 'q003', course_id: 'c001', type: 'judgment', question: '陪诊师可以代替患者做出医疗决策。', options: JSON.stringify(['A. 正确', 'B. 错误']), correct_answer: 'B', explanation: '陪诊师只能提供辅助服务，不能代替患者做出医疗决策。', difficulty: 1 },
      { id: 'q004', course_id: 'c001', type: 'multiple', question: '陪诊师应具备的职业素养包括？', options: JSON.stringify(['A. 诚实守信', 'B. 保护隐私', 'C. 尊重患者', 'D. 一切听患者指挥']), correct_answer: JSON.stringify(['A', 'B', 'C']), explanation: '陪诊师应具备职业道德和服务意识，但不是一切听患者指挥。', difficulty: 2 },

      // 课程2：职业礼仪
      { id: 'q005', course_id: 'c002', type: 'single', question: '陪诊师的着装要求是？', options: JSON.stringify(['A. 颜色鲜艳的运动服', 'B. 整洁得体的职业装', 'C. 便装即可', 'D. 医院白大褂']), correct_answer: 'B', explanation: '陪诊师应穿着整洁得体的职业装，体现专业性。', difficulty: 1 },
      { id: 'q006', course_id: 'c002', type: 'single', question: '以下哪项是服务禁用语？', options: JSON.stringify(['A. 请稍等', 'B. 不知道', 'C. 我帮您查一下', 'D. 祝您早日康复']), correct_answer: 'B', explanation: '"不知道"是服务禁语，应积极帮助患者解决问题。', difficulty: 1 },
      { id: 'q007', course_id: 'c002', type: 'judgment', question: '服务过程中可以接打私人电话。', options: JSON.stringify(['A. 正确', 'B. 错误']), correct_answer: 'B', explanation: '服务过程中应专注服务，不应接打私人电话。', difficulty: 1 },
      { id: 'q008', course_id: 'c002', type: 'multiple', question: '与患者沟通时应做到？', options: JSON.stringify(['A. 专注倾听', 'B. 适时回应', 'C. 记录关键信息', 'D. 随意打断对方']), correct_answer: JSON.stringify(['A', 'B', 'C']), explanation: '沟通时应专注倾听、适时回应、记录关键信息，不应随意打断。', difficulty: 2 },

      // 课程3：服务流程
      { id: 'q009', course_id: 'c003', type: 'single', question: '接单后首先应该做什么？', options: JSON.stringify(['A. 直接去医院', 'B. 核实患者基本信息', 'C. 给患者打电话聊天', 'D. 开始计费']), correct_answer: 'B', explanation: '接单后应核实患者基本信息，确保服务顺利。', difficulty: 1 },
      { id: 'q010', course_id: 'c003', type: 'single', question: '陪诊服务结束后应在多长时间内回访？', options: JSON.stringify(['A. 1小时内', 'B. 24小时内', 'C. 3天内', 'D. 一周内']), correct_answer: 'B', explanation: '应在24小时内进行电话回访，了解患者恢复情况。', difficulty: 1 },
      { id: 'q011', course_id: 'c003', type: 'judgment', question: '陪诊师可以代替患者签署知情同意书。', options: JSON.stringify(['A. 正确', 'B. 错误']), correct_answer: 'B', explanation: '知情同意书必须由患者本人或法定监护人签署。', difficulty: 1 },
      { id: 'q012', course_id: 'c003', type: 'multiple', question: '诊前准备包括哪些内容？', options: JSON.stringify(['A. 核实患者信息', 'B. 了解就诊医院和科室', 'C. 规划路线', 'D. 准备患者病历资料']), correct_answer: JSON.stringify(['A', 'B', 'C', 'D']), explanation: '诊前准备包括核实信息、了解医院科室、规划路线、准备资料等。', difficulty: 2 },

      // 课程4：医疗常识
      { id: 'q013', course_id: 'c004', type: 'single', question: '正常人体体温范围是？', options: JSON.stringify(['A. 35-36℃', 'B. 36-37℃', 'C. 37-38℃', 'D. 38-39℃']), correct_answer: 'B', explanation: '正常体温范围是36-37℃。', difficulty: 1 },
      { id: 'q014', course_id: 'c004', type: 'single', question: '心内科主要治疗哪种疾病？', options: JSON.stringify(['A. 肺炎', 'B. 心脏病', 'C. 胃炎', 'D. 糖尿病']), correct_answer: 'B', explanation: '心内科主要治疗心脏和血管相关疾病。', difficulty: 1 },
      { id: 'q015', course_id: 'c004', type: 'judgment', question: 'B超检查有辐射。', options: JSON.stringify(['A. 正确', 'B. 错误']), correct_answer: 'B', explanation: 'B超检查是利用超声波成像，没有辐射。', difficulty: 1 },
      { id: 'q016', course_id: 'c004', type: 'multiple', question: '用药注意事项包括？', options: JSON.stringify(['A. 按时服药', 'B. 注意服药方法', 'C. 了解不良反应', 'D. 可以自行停药']), correct_answer: JSON.stringify(['A', 'B', 'C']), explanation: '用药应遵医嘱按时服用，注意方法，了解反应，不可自行停药。', difficulty: 2 },

      // 课程5：急救技能
      { id: 'q017', course_id: 'c005', type: 'single', question: '胸外按压的正确位置是？', options: JSON.stringify(['A. 头部', 'B. 腹部', 'C. 两乳头连线中点', 'D. 背部']), correct_answer: 'C', explanation: '胸外按压应在两乳头连线中点进行。', difficulty: 1 },
      { id: 'q018', course_id: 'c005', type: 'single', question: '成人心肺复苏按压深度应为多少厘米？', options: JSON.stringify(['A. 2-3厘米', 'B. 4-5厘米', 'C. 5-6厘米', 'D. 8-10厘米']), correct_answer: 'C', explanation: '成人心肺复苏按压深度应为5-6厘米。', difficulty: 1 },
      { id: 'q019', course_id: 'c005', type: 'judgment', question: '发现烫伤应立即用冷水冲洗15-20分钟。', options: JSON.stringify(['A. 正确', 'B. 错误']), correct_answer: 'A', explanation: '烫伤后应立即用冷水冲洗15-20分钟，以降低温度。', difficulty: 1 },
      { id: 'q020', course_id: 'c005', type: 'multiple', question: '急救的基本原则包括？', options: JSON.stringify(['A. 安全第一', 'B. 快速评估', 'C. 及时呼救', 'D. 擅自用药']), correct_answer: JSON.stringify(['A', 'B', 'C']), explanation: '急救原则是安全第一、快速评估、及时呼救，不应擅自用药。', difficulty: 2 },

      // 课程6：法律法规
      { id: 'q021', course_id: 'c006', type: 'single', question: '陪诊师可以从事医疗诊疗活动吗？', options: JSON.stringify(['A. 可以', 'B. 不可以', 'C. 经过培训后可以', 'D. 看情况']), correct_answer: 'B', explanation: '陪诊师只能提供非医疗性的辅助服务，不得从事医疗诊疗活动。', difficulty: 1 },
      { id: 'q022', course_id: 'c006', type: 'single', question: '患者的隐私信息包括？', options: JSON.stringify(['A. 只有姓名', 'B. 只有病情', 'C. 身份信息、病情、治疗方案等', 'D. 都不保密']), correct_answer: 'C', explanation: '患者隐私包括身份信息、病情诊断、治疗方案等所有相关信息。', difficulty: 1 },
      { id: 'q023', course_id: 'c006', type: 'judgment', question: '陪诊师可以在朋友圈分享患者就诊信息。', options: JSON.stringify(['A. 正确', 'B. 错误']), correct_answer: 'B', explanation: '不得拍摄和传播患者信息，保护患者隐私。', difficulty: 1 },
      { id: 'q024', course_id: 'c006', type: 'multiple', question: '患者的基本权利包括？', options: JSON.stringify(['A. 知情权', 'B. 选择权', 'C. 隐私权', 'D. 强制医生开药权']), correct_answer: JSON.stringify(['A', 'B', 'C']), explanation: '患者有知情权、选择权、隐私权、受尊重权，但不能强制医生开药。', difficulty: 2 }
    ];

    for (const question of questions) {
      await client.from('questions').upsert(question);
    }

    return NextResponse.json({
      success: true,
      message: '初始化成功',
      courses: courses.length,
      chapters: chapters.length,
      questions: questions.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: '初始化失败' }, { status: 500 });
  }
}
