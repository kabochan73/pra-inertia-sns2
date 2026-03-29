<?php

use App\Models\Post;
use App\Models\User;

// いいね追加
test('ログイン済みならいいねできる', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post("/posts/{$post->id}/likes");

    $response->assertRedirect();
    $this->assertDatabaseHas('likes', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
});

test('未ログインはいいねできない', function () {
    $post = Post::factory()->create();

    $response = $this->post("/posts/{$post->id}/likes");

    $response->assertRedirect('/login');
    $this->assertDatabaseEmpty('likes');
});

test('同じ投稿に2回いいねできない', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)->post("/posts/{$post->id}/likes");
    $this->actingAs($user)->post("/posts/{$post->id}/likes");

    // likesテーブルに1件しかない
    $this->assertDatabaseCount('likes', 1);
});

// いいね解除
test('いいねを解除できる', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    // 先にいいねしておく
    $this->actingAs($user)->post("/posts/{$post->id}/likes");

    $response = $this
        ->actingAs($user)
        ->delete("/posts/{$post->id}/likes");

    $response->assertRedirect();
    $this->assertDatabaseEmpty('likes');
});
