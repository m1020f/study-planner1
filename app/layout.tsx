import "./globals.css";
import Sidebar from "./../components/Sidebar";

export const metadata = {
  title: "学習進捗アプリ",
  description: "AI x 学習進捗管理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800 flex">
        {/* サイドメニュー */}
        <Sidebar />

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
