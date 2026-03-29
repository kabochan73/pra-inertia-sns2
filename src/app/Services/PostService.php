<?php

namespace App\Services;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class PostService
{
    // タイムライン用の投稿一覧を取得
    public function getTimeline(): Collection
    {
        return Post::with('user')
            ->withCount('likes')
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
            'liked'          => $post->likes()->where('user_id', Auth::id())->exists(), // 自分がいいね済みか
            'user'           => [
                'id'   => $post->user->id,
                'name' => $post->user->name,
            ],
            'created_at' => $post->created_at->diffForHumans(), // 「3分前」のような表示
            'is_mine'    => $post->user_id === Auth::id(),       // 自分の投稿かどうか
        ];
    }
}
