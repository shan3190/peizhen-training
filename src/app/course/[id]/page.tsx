'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Chapter {
  id: string;
  title: string;
  content: string;
  duration: number;
  order_index: number;
  is_completed?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const headers: Record<string, string> = {};
        if (userId) headers['x-user-id'] = userId;

        const res = await fetch(`/api/courses/${courseId}`, { headers });
        const data = await res.json();

        if (data.success) {
          setCourse(data.course);
          setChapters(data.chapters || []);
          if (data.chapters?.length > 0) {
            setSelectedChapter(data.chapters[0]);
          }
        }
      } catch (error) {
        console.error('获取课程失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, userId]);

  const markComplete = async (chapterId: string) => {
    if (!userId) {
      alert('请先登录');
      router.push('/login');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          course_id: courseId,
          chapter_id: chapterId,
          is_completed: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setChapters(prev =>
          prev.map(ch =>
            ch.id === chapterId ? { ...ch, is_completed: true } : ch
          )
        );
        if (selectedChapter?.id === chapterId) {
          setSelectedChapter(prev => prev ? { ...prev, is_completed: true } : null);
        }
      }
    } catch (error) {
      console.error('标记完成失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const completedCount = chapters.filter(ch => ch.is_completed).length;
  const progress = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/main" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-800">{course?.title}</span>
          </div>
          {!userId && (
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              登录查看学习进度
            </Link>
          )}
        </div>
      </div>

      {/* 进度条 */}
      {userId && (
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {completedCount}/{chapters.length} 已完成 ({progress}%)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex">
        {/* 章节列表 */}
        <div className="w-80 bg-white border-r min-h-screen">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800">课程章节</h2>
          </div>
          <div className="py-2">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  selectedChapter?.id === chapter.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  chapter.is_completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {chapter.is_completed ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${
                    chapter.is_completed ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {chapter.title}
                  </div>
                  <div className="text-xs text-gray-400">{chapter.duration}分钟</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 章节内容 */}
        <div className="flex-1 p-8">
          {selectedChapter ? (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedChapter.title}
              </h1>
              <div
                className="prose prose-blue max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: selectedChapter.content }}
              />
              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <span className="text-gray-500">
                  学习时长：{selectedChapter.duration} 分钟
                </span>
                {!selectedChapter.is_completed && (
                  <button
                    onClick={() => markComplete(selectedChapter.id)}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? '保存中...' : '标记已完成'}
                  </button>
                )}
                {selectedChapter.is_completed && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                    ✓ 已完成
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              请选择一个章节开始学习
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
