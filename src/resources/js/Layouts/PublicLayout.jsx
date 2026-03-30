import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

/**
 * 未ログインユーザー向けのレイアウト
 * ナビバー（ロゴ + ログイン/登録リンク）とコンテンツエリアを提供する
 *
 * @param {ReactNode} header   - ページタイトルなどのヘッダー内容
 * @param {ReactNode} children - メインコンテンツ
 */
export default function PublicLayout({ header, children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* ナビゲーションバー */}
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* ロゴ */}
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                        </Link>

                        {/* ログイン / 新規登録リンク */}
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('login')}
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ログイン
                            </Link>
                            <Link
                                href={route('register')}
                                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                新規登録
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ページヘッダー（タイトルなど） */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* メインコンテンツ */}
            <main>{children}</main>
        </div>
    );
}
