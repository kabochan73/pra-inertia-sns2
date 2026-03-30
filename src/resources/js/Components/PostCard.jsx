import { Link, router, usePage } from '@inertiajs/react';

/**
 * 投稿カードコンポーネント
 * タイムラインに表示される1件分の投稿を描画する
 *
 * @param {object} post - PostService::formatPost() が返す投稿データ
 */
export default function PostCard({ post }) {
    // 現在ログイン中のユーザーを取得（未ログインなら null）
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    // いいねボタンを押したときの処理
    const handleLike = () => {
        if (post.liked) {
            // すでにいいね済み → DELETE /posts/:id/likes でいいね解除
            router.delete(route('likes.destroy', post.id));
        } else {
            // まだいいねしていない → POST /posts/:id/likes でいいね追加
            router.post(route('likes.store', post.id));
        }
    };

    // 投稿削除ボタンを押したときの処理
    const handleDelete = () => {
        // 確認ダイアログを表示してから削除
        if (confirm('この投稿を削除しますか？')) {
            router.delete(route('posts.destroy', post.id));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4">
            {/* 左カラム: 本の表紙画像 */}
            <div className="shrink-0">
                {post.book_thumbnail ? (
                    // サムネイルがある場合は画像を表示
                    <img
                        src={post.book_thumbnail}
                        alt={`${post.book_title}の表紙`}
                        className="w-16 h-24 object-cover rounded shadow"
                    />
                ) : (
                    // サムネイルがない場合はプレースホルダー
                    <div className="w-16 h-24 bg-gray-100 rounded shadow flex items-center justify-center text-gray-400 text-xs text-center leading-tight">
                        No<br />Image
                    </div>
                )}
            </div>

            {/* 右カラム: 投稿内容 */}
            <div className="flex-1 min-w-0">
                {/* ヘッダー: 本の情報 + 投稿者 + 削除ボタン */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        {/* 本のタイトル */}
                        <h3 className="font-bold text-gray-900 truncate">
                            {post.book_title}
                        </h3>
                        {/* 著者名（ある場合のみ表示） */}
                        {post.book_author && (
                            <p className="text-sm text-gray-500 truncate">
                                {post.book_author}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* 投稿者名（クリックでプロフィールへ）と投稿日時 */}
                        <div className="text-right">
                            <Link
                                href={route('users.show', post.user.id)}
                                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                            >
                                {post.user.name}
                            </Link>
                            <p className="text-xs text-gray-400">
                                {post.created_at}
                            </p>
                        </div>

                        {/* 自分の投稿のみ削除ボタンを表示 */}
                        {post.is_mine && (
                            <button
                                onClick={handleDelete}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="削除する"
                                aria-label="投稿を削除"
                            >
                                {/* ゴミ箱アイコン (SVG) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* 星評価 */}
                <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            // 評価以下の星は黄色、それ以上はグレー
                            className={`text-lg ${
                                star <= post.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-200'
                            }`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                        {post.rating}.0
                    </span>
                </div>

                {/* レビュー本文 */}
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {post.review}
                </p>

                {/* フッター: いいねボタン */}
                <div className="flex items-center mt-3">
                    {isLoggedIn ? (
                        // ログイン済み: クリックでいいね切り替え
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 text-sm transition-colors ${
                                post.liked
                                    ? 'text-red-500 hover:text-red-400' // いいね済み: 赤
                                    : 'text-gray-400 hover:text-red-400' // 未いいね: グレー
                            }`}
                            aria-label={post.liked ? 'いいねを取り消す' : 'いいねする'}
                        >
                            {/* ハートアイコン */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                // いいね済みは塗りつぶし、未いいねはアウトライン
                                fill={post.liked ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>{post.likes_count}</span>
                        </button>
                    ) : (
                        // 未ログイン: いいね数だけ表示（ボタンなし）
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>{post.likes_count}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
