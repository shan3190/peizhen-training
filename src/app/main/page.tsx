"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  chapters: number;
  completed: number;
}

export default function MainPage() {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // 从 localStorage 获取用户信息
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.id);
    }
  }, []);

  // 获取学习进度
  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress", {
          headers: { "x-user-id": userId },
        });
        const data = await res.json();
        if (data.success) {
          setProgress(data.progress || []);
        }
      } catch (error) {
        console.error("获取进度失败:", error);
      }
    };

    fetchProgress();
  }, [userId]);

  const courses = [
    {
      id: 1,
      image: "/course-1.png",
      title: "陪诊服务概述",
      desc: "了解陪诊服务的定义、发展历程、服务范围及职业前景",
      route: "1",
    },
    {
      id: 2,
      image: "/course-2.png",
      title: "服务流程",
      desc: "学习陪诊服务标准化流程，从接单到回访的完整服务闭环",
      route: "2",
    },
    {
      id: 3,
      image: "/course-3.png",
      title: "医疗常识",
      desc: "了解常见疾病症状、医院科室分布、检查检验项目解读",
      route: "3",
    },
    {
      id: 4,
      image: "/course-4.png",
      title: "法律法规",
      desc: "了解陪诊服务相关法律法规、患者权益保护、隐私保密规定",
      route: "4",
    },
    {
      id: 5,
      image: "/course-5.png",
      title: "急救技能",
      desc: "掌握基础急救知识和技能，包括心肺复苏、止血包扎、应急处理",
      route: "5",
    },
    {
      id: 6,
      image: "/course-6.png",
      title: "职业礼仪",
      desc: "掌握陪诊师职业礼仪规范，包括仪容仪表、沟通技巧、服务意识",
      route: "6",
    },
  ];

  const examItems = [
    { image: "/exam-bank.png", title: "题库", desc: "海量题库，随时练习" },
    { image: "/graduation-exam.png", title: "结业考试", desc: "在线考核，获取证书" },
  ];

  // 获取课程进度
  const getCourseProgress = (route: string) => {
    const found = progress.find((p) => p.id === parseInt(route));
    return found ? found.progress : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-blue-600">陪诊通</span>
          </div>

          {/* 登录/注册按钮 */}
          <div className="flex gap-2">
            {userId ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">学习中</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUserId(null);
                    setProgress([]);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  退出
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login?type=login"
                  className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/login?type=register"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 顶部装饰图 */}
      <div className="w-full">
        <Image
          src="/header-top.png"
          alt="顶部装饰"
          width={1920}
          height={200}
          className="w-full object-cover"
        />
      </div>

      {/* 主体背景图 */}
      <div className="w-full">
        <Image
          src="/header-bg.png"
          alt="主体背景"
          width={1920}
          height={400}
          className="w-full object-cover"
        />
      </div>

      {/* 分割线 */}
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="px-6 py-2 bg-blue-600 text-white rounded-full text-lg font-bold shadow-lg">
          培训课程
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </div>

      {/* 培训课程区域 - 3x2 网格 */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.route}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {/* 学习进度遮罩 */}
                {userId && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <div className="flex justify-between text-xs text-white mb-1">
                      <span>学习进度</span>
                      <span>{getCourseProgress(course.route)}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${getCourseProgress(course.route)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{course.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 分割线 */}
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
        <div className="px-6 py-2 bg-green-600 text-white rounded-full text-lg font-bold shadow-lg">
          题库和结业考试
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
      </div>

      {/* 题库和结业考试区域 */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 分割线 */}
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      </div>

      {/* 底部图片 */}
      <div className="w-full">
        <Image
          src="/footer-bg.png"
          alt="底部"
          width={1920}
          height={300}
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}
