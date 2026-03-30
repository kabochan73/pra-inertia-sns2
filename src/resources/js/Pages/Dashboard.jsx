import PostCard from '@/Components/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * ダッシュボードページ（タイムライン）
 *
 * @param {object} posts - ページネーション付き投稿データ
 *                         { data: [...], meta: { current_page, last_page, total, ... } }
 * @param {string} query - 現在の検索キーワード（未検索時は空文字）
 */
export default function Dashboard({ posts, query }) {
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    const [searchInput, setSearchInput] = useState(query);
    const Layout = isLoggedIn ? AuthenticatedLayout : PublicLayout;

    // デバウンス: 入力が止まってから 500ms 後に検索リクエストを送る
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

    // 検索クリア
    const handleReset = () => {
        setSearchInput('');
    };

    // ページを移動する（検索クエリを維持したまま）
    const handlePageChange = (page) => {
        router.get(route('dashboard'),
            // 検索中なら q パラメータも一緒に送る
            { ...(query ? { q: query } : {}), page },
            { preserveState: true },
        );
    };

    // ページネーションのメタ情報
    // Inertia は LengthAwarePaginator をフラットな構造に変換するため
    // posts.meta ではなく posts 直下に current_page 等が入る
    const { current_page, last_page, total } = posts;

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    タイムライン
                </h2>
            }
        >
            <Head title="タイムライン" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* 検索フォーム */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="タイトルや著者名で検索..."
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="shrink-0 px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                            >
                                クリア
                            </button>
                        )}
                    </div>

                    {/* 検索中は件数を表示 */}
                    {query && (
                        <p className="text-sm text-gray-500">
                            「{query}」の検索結果: {total} 件
                        </p>
                    )}

                    {/* 投稿一覧 */}
                    {/* Inertia はページネーターの投稿データを posts.data に入れる */}
                    {posts.data.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-5xl mb-4">📚</p>
                            <p className="text-lg font-medium">
                                {query ? '検索結果が見つかりませんでした' : 'まだ投稿がありません'}
                            </p>
                            <p className="text-sm mt-1">
                                {query
                                    ? '別のキーワードで試してみてください'
                                    : isLoggedIn
                                        ? '最初のレビューを投稿してみましょう！'
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

                    {/* ページネーション（2ページ以上あるときだけ表示） */}
                    {last_page > 1 && (
                        <div className="flex items-center justify-center gap-1 pt-2">

                            {/* 前のページへ */}
                            <button
                                onClick={() => handlePageChange(current_page - 1)}
                                disabled={current_page === 1} // 1ページ目は無効
                                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← 前へ
                            </button>

                            {/* ページ番号ボタン */}
                            {Array.from({ length: last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                        page === current_page
                                            // 現在のページは強調表示
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* 次のページへ */}
                            <button
                                onClick={() => handlePageChange(current_page + 1)}
                                disabled={current_page === last_page} // 最終ページは無効
                                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
