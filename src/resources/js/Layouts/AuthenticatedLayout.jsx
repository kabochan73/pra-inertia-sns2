import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-sky-50">
            {/* ナビゲーションバー */}
            <nav className="bg-white border-b border-sky-100 shadow-sm">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">

                        {/* 左: ロゴ + ナビリンク */}
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                {/* ロゴの代わりにテキストロゴ */}
                                <span className="text-xl font-extrabold text-sky-500 tracking-tight">
                                    📚 BookLog
                                </span>
                            </Link>

                            {/* PC用ナビリンク */}
                            <div className="hidden sm:flex items-center gap-1">
                                <Link
                                    href={route('dashboard')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        route().current('dashboard')
                                            ? 'bg-sky-100 text-sky-700'
                                            : 'text-gray-500 hover:text-sky-600 hover:bg-sky-50'
                                    }`}
                                >
                                    タイムライン
                                </Link>
                                <Link
                                    href={route('users.show', user.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        route().current('users.show', user.id)
                                            ? 'bg-sky-100 text-sky-700'
                                            : 'text-gray-500 hover:text-sky-600 hover:bg-sky-50'
                                    }`}
                                >
                                    マイページ
                                </Link>
                            </div>
                        </div>

                        {/* 右: 投稿ボタン + ユーザーメニュー */}
                        <div className="hidden sm:flex items-center gap-3">
                            {/* 投稿ボタン */}
                            <Link
                                href={route('posts.create')}
                                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
                            >
                                ＋ 投稿する
                            </Link>

                            {/* ユーザードロップダウン */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    {/* アバター: 頭文字を丸く表示 */}
                                    <button className="w-9 h-9 rounded-full bg-sky-400 text-white font-bold text-sm flex items-center justify-center hover:bg-sky-500 transition-colors">
                                        {user.name.charAt(0).toUpperCase()}
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
                                        {user.name}
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        アカウント設定
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        ログアウト
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* モバイル: ハンバーガーボタン */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="p-2 rounded-md text-gray-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* モバイルメニュー */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-sky-100'}>
                    <div className="space-y-1 px-4 py-3">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            タイムライン
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('users.show', user.id)} active={route().current('users.show', user.id)}>
                            マイページ
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('posts.create')}>
                            投稿する
                        </ResponsiveNavLink>
                    </div>
                    <div className="border-t border-sky-100 px-4 py-3 space-y-1">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <ResponsiveNavLink href={route('profile.edit')}>アカウント設定</ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">ログアウト</ResponsiveNavLink>
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
