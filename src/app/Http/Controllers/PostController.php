<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService // DIコンテナが自動でインスタンスを注入してくれる
    ) {}

    // 投稿フォームページを表示
    public function create(): Response
    {
        return Inertia::render('Posts/Create');
    }

    // タイムライン表示
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'posts' => $this->postService->getTimeline(),
        ]);
    }

    // 投稿作成
    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->postService->store($request);

        // 投稿後は自分のプロフィールページへリダイレクト
        return redirect()->route('users.show', Auth::id());
    }

    // 投稿削除（自分の投稿のみ）
    public function destroy(Post $post): RedirectResponse
    {
        abort_if($post->user_id !== Auth::id(), 403); // 他人の投稿は削除不可

        $this->postService->destroy($post);

        return redirect()->route('dashboard');
    }
}
