<?php

namespace App\Services;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class PostService
{
    // タイムライン用の投稿一覧を取得（ページネーション対応）
    // $query が渡された場合はタイトルまたは著者名で絞り込む
    public function getTimeline(?string $query = null): LengthAwarePaginator
    {
        return Post::with('user')
            ->withCount('likes')
            ->when($query, function ($q) use ($query) {
                // LIKE 検索: タイトルか著者名のどちらかにヒットすれば表示
                $q->where(function ($q) use ($query) {
                    $q->where('book_title', 'like', "%{$query}%")
                      ->orWhere('book_author', 'like', "%{$query}%");
                });
            })
            ->latest()
            ->paginate(10) // 1ページあたり10件
            ->through(fn(Post $post) => $this->formatPost($post));
            // through(): paginate() の結果を map() のように変換しつつ
            // ページネーションのメタ情報（総件数・現在ページ等）を保持する
    }

    // 特定ユーザーの投稿一覧を取得（プロフィールページ用）
    public function getPostsByUser(User $user): Collection
    {
        return Post::with('user')
            ->withCount('likes')
            ->where('user_id', $user->id) // そのユーザーの投稿のみ絞り込む
            ->latest()
            ->get()
            ->map(fn(Post $post) => $this->formatPost($post));
    }

    // 投稿を作成
    public function store(StorePostRequest $request): void
    {
        $request->user()->posts()->create($request->validated());
    }

    // 投稿を削除
    public function destroy(Post $post): void
    {
        $post->delete();
    }

    // 投稿データを整形（Reactに渡す形式に変換）
    private function formatPost(Post $post): array
    {
        return [
            'id'             => $post->id,
            'book_title'     => $post->book_title,
            'book_author'    => $post->book_author,
            'book_thumbnail' => $post->book_thumbnail,
            'review'         => $post->review,
            'rating'         => $post->rating,
            'likes_count'    => $post->likes_count,
            'liked'          => Auth::check() && $post->likes()->where('user_id', Auth::id())->exists(), // 自分がいいね済みか（未ログインはfalse）
            'user'           => [
                'id'   => $post->user->id,
                'name' => $post->user->name,
            ],
            'created_at' => $post->created_at->diffForHumans(), // 「3分前」のような表示
            'is_mine'    => Auth::check() && $post->user_id === Auth::id(), // 自分の投稿かどうか（未ログインはfalse）
        ];
    }
}
