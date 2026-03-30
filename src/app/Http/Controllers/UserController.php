<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PostService;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly PostService $postService
    ) {}

    /**
     * 公開プロフィールページを表示する
     * URL: GET /users/{user}
     *
     * @param User $user Laravel のルートモデルバインディングで自動取得
     */
    public function show(User $user): Response
    {
        // そのユーザーが受け取ったいいねの合計数
        $totalLikes = $user->posts()->withCount('likes')->get()->sum('likes_count');

        return Inertia::render('Profile/Show', [
            // プロフィール情報（メールアドレスは公開しない）
            'profileUser' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'created_at' => $user->created_at->format('Y年n月'), // 登録年月
            ],
            // 統計情報
            'stats' => [
                'posts_count' => $user->posts()->count(), // 投稿数
                'likes_count' => $totalLikes,             // もらったいいね数
            ],
            // そのユーザーの投稿一覧
            'posts' => $this->postService->getPostsByUser($user),
        ]);
    }
}
