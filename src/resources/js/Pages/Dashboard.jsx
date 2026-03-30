import PostCard from '@/Components/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';

/**
 * ダッシュボードページ（タイムライン）
 * 投稿フォームはプロフィールページに移動したため、ここでは閲覧のみ。
 *
 * - ログイン済み: 投稿一覧 + 自分のプロフィールへのリンク
 * - 未ログイン  : 投稿一覧のみ（閲覧専用）
 *
 * @param {object[]} posts - PostService::getTimeline() が返す投稿の配列
 */
export default function Dashboard({ posts }) {
    // ログイン中のユーザーを取得（未ログインなら null）
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    // ログイン済みと未ログインでレイアウトを切り替える
    const Layout = isLoggedIn ? AuthenticatedLayout : PublicLayout;

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

                    {/* ログイン済みの場合、自分のプロフィール（投稿フォームがある）へ誘導 */}
                    {isLoggedIn && (
                        <div className="text-right">
                            <Link
                                href={route('users.show', auth.user.id)}
                                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                レビューを投稿する →
                            </Link>
                        </div>
                    )}

                    {/* 投稿一覧 */}
                    {posts.length === 0 ? (
                        // 投稿がまだない場合の空状態
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-5xl mb-4">📚</p>
                            <p className="text-lg font-medium">まだ投稿がありません</p>
                            <p className="text-sm mt-1">
                                {isLoggedIn
                                    ? '最初のレビューを投稿してみましょう！'
                                    : 'ログインして最初のレビューを投稿しましょう！'}
                            </p>
                        </div>
                    ) : (
                        // 投稿カードを新着順に並べる
                        <div className="space-y-4">
                            {posts.map((post) => (
                                // key に投稿IDを使うことで React が差分更新を効率化できる
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
