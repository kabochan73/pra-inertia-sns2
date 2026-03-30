import PostCard from '@/Components/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';

/**
 * 公開プロフィールページ
 *
 * @param {object}   profileUser - 表示対象のユーザー情報（id, name, created_at）
 * @param {object}   stats       - 統計情報（posts_count, likes_count）
 * @param {object[]} posts       - そのユーザーの投稿一覧
 */
export default function Show({ profileUser, stats, posts }) {
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;
    const isOwnProfile = isLoggedIn && auth.user.id === profileUser.id;
    const Layout = isLoggedIn ? AuthenticatedLayout : PublicLayout;

    // 頭文字（アバター代わり）
    const initial = profileUser.name.charAt(0).toUpperCase();

    return (
        <Layout>
            <Head title={`${profileUser.name} のプロフィール`} />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* プロフィールカード */}
                    <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
                        {/* カラーバナー */}
                        <div className="h-20 bg-gradient-to-r from-sky-400 to-blue-500" />

                        <div className="px-6 pb-6">
                            {/* アバター（バナーに半分かかるように -mt） */}
                            <div className="flex items-end justify-between -mt-10 mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-sky-500 text-3xl font-extrabold">
                                    {initial}
                                </div>

                                {/* 自分のプロフィール: 投稿ボタン */}
                                {isOwnProfile && (
                                    <Link
                                        href={route('posts.create')}
                                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
                                    >
                                        ＋ 投稿する
                                    </Link>
                                )}
                            </div>

                            {/* 名前 + 登録日 */}
                            <h1 className="text-xl font-extrabold text-gray-900">
                                {profileUser.name}
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {profileUser.created_at} から利用
                            </p>

                            {/* 統計バッジ */}
                            <div className="flex gap-4 mt-4">
                                <div className="bg-sky-50 rounded-xl px-4 py-2 text-center">
                                    <p className="text-xl font-extrabold text-sky-600">{stats.posts_count}</p>
                                    <p className="text-xs text-sky-400 mt-0.5">投稿</p>
                                </div>
                                <div className="bg-rose-50 rounded-xl px-4 py-2 text-center">
                                    <p className="text-xl font-extrabold text-rose-500">{stats.likes_count}</p>
                                    <p className="text-xs text-rose-300 mt-0.5">もらったいいね</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 投稿一覧 */}
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">
                        投稿したレビュー
                    </h2>

                    {posts.length === 0 ? (
                        <div className="text-center py-16 text-gray-300">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-sm font-medium">まだ投稿がありません</p>
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
