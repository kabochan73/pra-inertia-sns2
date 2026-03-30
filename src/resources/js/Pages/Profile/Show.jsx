import PostCard from '@/Components/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';

/**
 * 公開プロフィールページ
 * 誰でも閲覧可能。ユーザーの情報・統計・投稿一覧を表示する。
 *
 * @param {object}   profileUser - 表示対象のユーザー情報（id, name, created_at）
 * @param {object}   stats       - 統計情報（posts_count, likes_count）
 * @param {object[]} posts       - そのユーザーの投稿一覧
 */
export default function Show({ profileUser, stats, posts }) {
    // 現在ログイン中のユーザーを取得（未ログインなら null）
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    // 表示中のプロフィールが自分自身かどうか
    // → true のときだけ投稿フォームを表示する
    const isOwnProfile = isLoggedIn && auth.user.id === profileUser.id;

    // ログイン状態でレイアウトを切り替え
    const Layout = isLoggedIn ? AuthenticatedLayout : PublicLayout;

    // ユーザー名の頭文字（アバター代わりに使う）
    const initial = profileUser.name.charAt(0).toUpperCase();

    return (
        <Layout>
            <Head title={`${profileUser.name} のプロフィール`} />

            <div className="py-10">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ========== プロフィールカード ========== */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                        {/* アバター + 名前 + 登録日 */}
                        <div className="flex items-center gap-4">
                            {/* アバター: 画像がないので頭文字を大きく表示 */}
                            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                                {initial}
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {profileUser.name}
                                </h1>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    {profileUser.created_at} から利用
                                </p>
                            </div>
                        </div>

                        {/* 区切り線 */}
                        <hr className="my-4 border-gray-100" />

                        {/* 統計: 投稿数 / もらったいいね数 */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                {/* 数字を大きく、ラベルを小さく表示 */}
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats.posts_count}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">投稿</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">
                                    {stats.likes_count}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">もらったいいね</p>
                            </div>
                        </div>
                    </div>

                    {/* 自分のプロフィールのときだけ投稿ページへのリンクを表示 */}
                    {isOwnProfile && (
                        <div className="text-right">
                            <Link
                                href={route('posts.create')}
                                className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                + レビューを投稿する
                            </Link>
                        </div>
                    )}

                    {/* ========== 投稿一覧 ========== */}
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        投稿したレビュー
                    </h2>

                    {posts.length === 0 ? (
                        // 投稿がまだない場合
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-4xl mb-3">📚</p>
                            <p className="text-sm">まだ投稿がありません</p>
                        </div>
                    ) : (
                        // 投稿カードを新着順に表示
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
