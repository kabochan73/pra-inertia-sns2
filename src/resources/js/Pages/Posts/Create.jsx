import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

/**
 * 投稿作成ページ
 * ログイン済みユーザーのみアクセス可能（ルートで auth ミドルウェアを適用済み）
 */
export default function Create() {
    // ログイン中のユーザーIDを取得（キャンセル時のリダイレクト先に使う）
    const { auth } = usePage().props;

    // useForm: Inertia のフォーム管理フック
    const { data, setData, post, processing, errors, reset } = useForm({
        book_title: '',
        book_author: '',
        book_thumbnail: '',
        google_books_id: '',
        review: '',
        rating: 5,
    });

    // ----- Google Books API 検索まわりの state -----

    // 検索ボックスの入力値（フォームの book_title とは別管理）
    const [searchQuery, setSearchQuery] = useState('');

    // 検索結果の配列
    const [searchResults, setSearchResults] = useState([]);

    // 検索中かどうかのフラグ（ローディング表示に使う）
    const [searching, setSearching] = useState(false);

    // 検索エラーメッセージ
    const [searchError, setSearchError] = useState('');

    // ----- 本を検索する関数 -----
    const handleSearch = async () => {
        // 入力が空なら何もしない
        if (!searchQuery.trim()) return;

        setSearching(true);
        setSearchError('');
        setSearchResults([]);

        try {
            // axios はセッションクッキーと CSRF トークンを自動で付けてくれるため
            // auth ミドルウェア付きのルートにもそのままアクセスできる
            const res = await axios.get('/books/search', {
                params: { q: searchQuery },
            });

            if (res.data.books.length === 0) {
                setSearchError('該当する本が見つかりませんでした');
                return;
            }

            setSearchResults(res.data.books);
        } catch (e) {
            setSearchError('検索中にエラーが発生しました。しばらく待ってから再試行してください。');
        } finally {
            // 成功・失敗どちらでも検索中フラグを解除
            setSearching(false);
        }
    };

    // Enter キーでも検索できるようにする
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // フォーム送信を防ぐ
            handleSearch();
        }
    };

    // 検索結果から本を選んだときにフォームへ自動入力する
    const handleSelectBook = (book) => {
        setData({
            ...data,
            book_title: book.title,
            book_author: book.author,
            book_thumbnail: book.thumbnail ?? '',
            // Open Library の ID は "/works/OL12345W" 形式なのでスラッシュを除去して保存
            google_books_id: book.id.replace(/\//g, '_'),
        });
        // 選択後は検索結果を閉じる
        setSearchResults([]);
        setSearchQuery('');
    };

    // フォーム送信ハンドラ
    const handleSubmit = (e) => {
        e.preventDefault();
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
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* ========== 本の検索セクション ========== */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            本を検索して自動入力
                        </h3>

                        {/* 検索入力欄 + ボタン */}
                        <div className="flex gap-2">
                            <TextInput
                                type="text"
                                className="block w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="タイトルや著者名で検索..."
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={searching}
                                className="shrink-0 px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {searching ? '検索中...' : '検索'}
                            </button>
                        </div>

                        {/* 検索エラー */}
                        {searchError && (
                            <p className="mt-2 text-sm text-red-500">{searchError}</p>
                        )}

                        {/* 検索結果一覧 */}
                        {searchResults.length > 0 && (
                            <ul className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
                                {searchResults.map((book) => (
                                    <li key={book.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectBook(book)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 transition-colors text-left"
                                        >
                                            {/* サムネイル */}
                                            {book.thumbnail ? (
                                                <img
                                                    src={book.thumbnail}
                                                    alt={book.title}
                                                    className="w-10 h-14 object-cover rounded shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-gray-100 rounded shrink-0 flex items-center justify-center text-gray-400 text-xs">
                                                    No
                                                </div>
                                            )}

                                            {/* タイトル・著者 */}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {book.title}
                                                </p>
                                                {book.author && (
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {book.author}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ========== 投稿フォーム ========== */}
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

                            {/* 選択された表紙のプレビュー */}
                            {data.book_thumbnail && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <img
                                        src={data.book_thumbnail}
                                        alt="表紙プレビュー"
                                        className="w-12 h-16 object-cover rounded shadow"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500">表紙画像が設定されました</p>
                                        {/* クリアボタン */}
                                        <button
                                            type="button"
                                            onClick={() => setData('book_thumbnail', '')}
                                            className="text-xs text-red-400 hover:text-red-600 mt-1"
                                        >
                                            削除する
                                        </button>
                                    </div>
                                </div>
                            )}

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
                                {/* キャンセル → 自分のプロフィールページへ戻る */}
                                <Link
                                    href={route('users.show', auth.user.id)}
                                    className="text-sm text-gray-500 hover:text-gray-700 self-center mr-4"
                                >
                                    キャンセル
                                </Link>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
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
