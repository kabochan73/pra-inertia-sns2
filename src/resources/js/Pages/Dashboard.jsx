import PostCard from '@/Components/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * ダッシュボードページ（タイムライン）
 *
 * @param {object} posts - ページネーション付き投稿データ { data, current_page, last_page, total }
 * @param {string} query - 現在の検索キーワード
 */
export default function Dashboard({ posts, query }) {
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;
    const [searchInput, setSearchInput] = useState(query);
    const Layout = isLoggedIn ? AuthenticatedLayout : PublicLayout;

    // デバウンス検索
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput === query) return;
            router.get(route('dashboard'),
                searchInput ? { q: searchInput } : {},
                { preserveState: true },
            );
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleReset = () => setSearchInput('');

    const handlePageChange = (page) => {
        router.get(route('dashboard'),
            { ...(query ? { q: query } : {}), page },
            { preserveState: true },
        );
    };

    const { current_page, last_page, total } = posts;

    return (
        <Layout>
            <Head title="タイムライン" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* ヒーロー: 未ログイン向けの案内 */}
                    {!isLoggedIn && (
                        <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl p-6 text-white shadow">
                            <p className="text-2xl font-extrabold">📚 BookLog</p>
                            <p className="mt-1 text-sky-100 text-sm">みんなの本のレビューを読んで、次の一冊を見つけよう。</p>
                        </div>
                    )}

                    {/* 検索フォーム */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            {/* 虫眼鏡アイコン */}
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="タイトルや著者名で検索..."
                                className="w-full pl-9 pr-4 py-2.5 border border-sky-200 rounded-full bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                            />
                        </div>
                        {searchInput && (
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-white border border-sky-200 text-gray-500 text-sm rounded-full hover:bg-sky-50 transition-colors shadow-sm"
                            >
                                クリア
                            </button>
                        )}
                    </div>

                    {/* 検索結果の件数 */}
                    {query && (
                        <p className="text-sm text-sky-600 font-medium">
                            「{query}」の検索結果: {total} 件
                        </p>
                    )}

                    {/* 投稿一覧 */}
                    {posts.data.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-5xl mb-4">📭</p>
                            <p className="font-medium">
                                {query ? '検索結果が見つかりませんでした' : 'まだ投稿がありません'}
                            </p>
                            <p className="text-sm mt-1">
                                {query ? '別のキーワードで試してみてください'
                                    : isLoggedIn ? 'マイページから最初のレビューを投稿しましょう！'
                                    : 'ログインして最初のレビューを投稿しましょう！'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* ページネーション */}
                    {last_page > 1 && (
                        <div className="flex items-center justify-center gap-1.5 pt-2">
                            <button
                                onClick={() => handlePageChange(current_page - 1)}
                                disabled={current_page === 1}
                                className="px-3 py-1.5 text-sm rounded-full border border-sky-200 text-sky-600 bg-white hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← 前へ
                            </button>

                            {Array.from({ length: last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-9 h-9 text-sm rounded-full border transition-colors font-medium ${
                                        page === current_page
                                            ? 'bg-sky-500 text-white border-sky-500 shadow'
                                            : 'bg-white border-sky-200 text-sky-600 hover:bg-sky-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(current_page + 1)}
                                disabled={current_page === last_page}
                                className="px-3 py-1.5 text-sm rounded-full border border-sky-200 text-sky-600 bg-white hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                次へ →
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
