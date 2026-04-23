import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* 主页大图 */}
      <div className="w-full max-w-4xl mb-8">
        <img
          src="/home-banner.png"
          alt="陪诊师专业培训平台"
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
      </div>

      {/* 进入按钮 */}
      <Link
        href="/main"
        className="px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg transition-all hover:shadow-xl transform hover:scale-105"
      >
        开始学习
      </Link>

      {/* 底部信息 */}
      <p className="mt-8 text-gray-500 text-sm">
        陪有所术，诊无所忧
      </p>
    </div>
  );
}
