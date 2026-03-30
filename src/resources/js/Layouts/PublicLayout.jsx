import { Link } from '@inertiajs/react';

export default function PublicLayout({ header, children }) {
    return (
        <div className="min-h-screen bg-sky-50">
            {/* ナビゲーションバー */}
            <nav className="bg-white border-b border-sky-100 shadow-sm">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* テキストロゴ */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-sky-500 tracking-tight">
                                📚 BookLog
                            </span>
                        </Link>

                        {/* ログイン / 新規登録 */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('login')}
                                className="px-4 py-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                            >
                                ログイン
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
                            >
                                新規登録
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ページヘッダー */}
            {header && (
                <header className="bg-white border-b border-sky-100">
                    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
