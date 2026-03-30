import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

/**
 * 投稿作成ページ
 * ログイン済みユーザーのみアクセス可能（ルートで auth ミドルウェアを適用済み）
 */
export default function Create() {
    // useForm: Inertia のフォーム管理フック
    const { data, setData, post, processing, errors, reset } = useForm({
        book_title: '',
        book_author: '',
        book_thumbnail: '',
        review: '',
        rating: 5,
    });

    // フォーム送信ハンドラ
    const handleSubmit = (e) => {
        e.preventDefault();

        // POST /posts へ送信。成功後は PostController::store でリダイレクト
        post(route('posts.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    レビューを投稿する
                </h2>
            }
        >
            <Head title="レビューを投稿する" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* 本のタイトル（必須） */}
                            <div>
                                <InputLabel htmlFor="book_title" value="本のタイトル *" />
                                <TextInput
                                    id="book_title"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.book_title}
                                    onChange={(e) => setData('book_title', e.target.value)}
                                    placeholder="例: Clean Code"
                                    autoFocus // ページ表示時に自動でフォーカス
                                />
                                <InputError message={errors.book_title} className="mt-1" />
                            </div>

                            {/* 著者名（任意） */}
                            <div>
                                <InputLabel htmlFor="book_author" value="著者名" />
                                <TextInput
                                    id="book_author"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.book_author}
                                    onChange={(e) => setData('book_author', e.target.value)}
                                    placeholder="例: Robert C. Martin"
                                />
                                <InputError message={errors.book_author} className="mt-1" />
                            </div>

                            {/* 表紙画像URL（任意） */}
                            <div>
                                <InputLabel htmlFor="book_thumbnail" value="表紙画像URL（任意）" />
                                <TextInput
                                    id="book_thumbnail"
                                    type="url"
                                    className="mt-1 block w-full"
                                    value={data.book_thumbnail}
                                    onChange={(e) => setData('book_thumbnail', e.target.value)}
                                    placeholder="https://..."
                                />
                                <InputError message={errors.book_thumbnail} className="mt-1" />
                            </div>

                            {/* 評価（星1〜5） */}
                            <div>
                                <InputLabel value="評価 *" />
                                <div className="flex gap-2 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className={`text-3xl transition-transform hover:scale-110 ${
                                                // 選択済みの星は黄色、未選択はグレー
                                                star <= data.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                            aria-label={`${star}星`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="text-sm text-gray-500 self-center ml-1">
                                        {data.rating} / 5
                                    </span>
                                </div>
                                <InputError message={errors.rating} className="mt-1" />
                            </div>

                            {/* レビュー本文（必須） */}
                            <div>
                                <InputLabel htmlFor="review" value="レビュー *" />
                                <textarea
                                    id="review"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    rows={6}
                                    value={data.review}
                                    onChange={(e) => setData('review', e.target.value)}
                                    placeholder="この本の感想を書いてください（最大1000文字）"
                                    maxLength={1000}
                                />
                                {/* 残り文字数カウンター */}
                                <div className="flex justify-between mt-1">
                                    <InputError message={errors.review} />
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {data.review.length} / 1000
                                    </span>
                                </div>
                            </div>

                            {/* 送信ボタン */}
                            <div className="flex justify-end pt-2">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing} // 送信中はボタンを無効化（二重送信防止）
                                >
                                    {processing ? '投稿中...' : '投稿する'}
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
