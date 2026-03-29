<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    // いいね追加
    public function store(Request $request, Post $post): RedirectResponse
    {
        $post->likes()->firstOrCreate([
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back();
    }

    // いいね削除
    public function destroy(Request $request, Post $post): RedirectResponse
    {
        $post->likes()->where('user_id', $request->user()->id)->delete();

        return redirect()->back();
    }
}
