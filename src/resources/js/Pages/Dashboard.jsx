import PostCard from '@/Components/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * ダッシュボードページ（タイムライン）
 *
 * @param {object[]} posts - 投稿一覧（検索結果 or 全件）
 * @param {string}   query - 現在の検索キーワード（未検索時は空文字）
 */
export default function Dashboard({ posts, query }) {
    // ログイン中のユーザーを取得（未ログインなら null）
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    // 検索フォームの入力値（サーバーから返ってきた query で初期化）
    const [searchInput, setSearchInput] = useState(query);

    // ログイン済みと未ログインでレイアウトを切り替える
    const Layout = isLoggedIn ? AuthenticatedLayout : PublicLayout;

    // デバウンス: searchInput が変わってから 500ms 後にリクエストを送る
    useEffect(() => {
        // タイマーをセット
        const timer = setTimeout(() => {
            // 入力値が現在の検索クエリと同じなら何もしない（初回レンダリング時の無駄なリクエストを防ぐ）
            if (searchInput === query) return;

            router.get(route('dashboard'),
                // 空文字のときはパラメータなし（URLを ?q= にしない）
                searchInput ? { q: searchInput } : {},
                { preserveState: true },
            );
        }, 500); // 500ms 待つ

        // 次の入力が来たら前のタイマーをキャンセル
        // これにより「最後の入力から 500ms 後」だけリクエストが飛ぶ
        return () => clearTimeout(timer);
    }, [searchInput]); // searchInput が変わるたびに実行

    // 検索をリセットして全件表示に戻す
    const handleReset = () => {
        setSearchInput('');
    };

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

                    {/* 検索フォーム（入力のたびに自動検索・デバウンスあり） */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="タイトルや著者名で検索..."
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                        {/* 入力があるときだけクリアボタンを表示 */}
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

                    {/* 検索中の場合は件数を表示 */}
                    {query && (
                        <p className="text-sm text-gray-500">
                            「{query}」の検索結果: {posts.length} 件
                        </p>
                    )}

                    {/* 投稿一覧 */}
                    {posts.length === 0 ? (
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
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
