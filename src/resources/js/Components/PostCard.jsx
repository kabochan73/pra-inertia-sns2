import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

/**
 * 投稿カードコンポーネント
 * タイムラインに表示される1件分の投稿を描画する
 *
 * @param {object} post - PostService::formatPost() が返す投稿データ
 */
export default function PostCard({ post }) {
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    // アニメーション用フラグ
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = () => {
        // クリック時にハートをぷるっと弾ませる
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        if (post.liked) {
            router.delete(route('likes.destroy', post.id));
        } else {
            router.post(route('likes.store', post.id));
        }
    };

    const handleDelete = () => {
        if (confirm('この投稿を削除しますか？')) {
            router.delete(route('posts.destroy', post.id));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-5 flex gap-4 hover:shadow-md transition-shadow">

            {/* 左カラム: 本の表紙 */}
            <div className="shrink-0">
                {post.book_thumbnail ? (
                    <img
                        src={post.book_thumbnail}
                        alt={`${post.book_title}の表紙`}
                        className="w-16 h-24 object-cover rounded-xl shadow"
                    />
                ) : (
                    // 表紙なしのプレースホルダー
                    <div className="w-16 h-24 bg-sky-100 rounded-xl shadow flex flex-col items-center justify-center text-sky-300 text-2xl">
                        📖
                    </div>
                )}
            </div>

            {/* 右カラム: 投稿内容 */}
            <div className="flex-1 min-w-0">

                {/* ヘッダー: 本の情報 + 投稿者 */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-base leading-snug">
                            {post.book_title}
                        </h3>
                        {post.book_author && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                {post.book_author}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* 投稿者 + 日時 */}
                        <div className="text-right">
                            <Link
                                href={route('users.show', post.user.id)}
                                className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
                            >
                                {post.user.name}
                            </Link>
                            <p className="text-xs text-gray-300 mt-0.5">
                                {post.created_at}
                            </p>
                        </div>

                        {/* 削除ボタン（自分の投稿のみ） */}
                        {post.is_mine && (
                            <button
                                onClick={handleDelete}
                                className="text-gray-300 hover:text-red-400 transition-colors"
                                aria-label="投稿を削除"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* 星評価 */}
                <div className="flex items-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`text-base ${star <= post.rating ? 'text-amber-400' : 'text-gray-200'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* レビュー本文 */}
                <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words line-clamp-4">
                    {post.review}
                </p>

                {/* フッター: いいねボタン */}
                <div className="flex items-center mt-3">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                                post.liked ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'
                            }`}
                            aria-label={post.liked ? 'いいねを取り消す' : 'いいねする'}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 transition-transform duration-150 ${isAnimating ? 'scale-125' : 'scale-100'}`}
                                fill={post.liked ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{post.likes_count}</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5 text-sm text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{post.likes_count}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
