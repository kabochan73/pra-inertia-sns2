<?php

use App\Models\Post;
use App\Models\User;

// タイムライン表示
test('未ログインでもタイムラインが見れる', function () {
    $response = $this->get('/dashboard');

    $response->assertOk();
});

// 投稿作成
test('ログイン済みなら投稿できる', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/posts', [
            'book_title' => 'ハリー・ポッター',
            'book_author' => 'J.K.ローリング',
            'review' => '面白かった！',
            'rating' => 5,
        ]);

    $response->assertRedirect('/dashboard');
    $this->assertDatabaseHas('posts', [
        'user_id' => $user->id,
        'book_title' => 'ハリー・ポッター',
    ]);
});

test('未ログインは投稿できない', function () {
    $response = $this->post('/posts', [
        'book_title' => 'ハリー・ポッター',
        'book_author' => 'J.K.ローリング',
        'review' => '面白かった！',
        'rating' => 5,
    ]);

    $response->assertRedirect('/login'); // ログインページにリダイレクト
    $this->assertDatabaseEmpty('posts');
});

// 投稿削除
test('自分の投稿を削除できる', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $response = $this
        ->actingAs($user)
        ->delete("/posts/{$post->id}");

    $response->assertRedirect('/dashboard');
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

test('他人の投稿は削除できない', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $other->id]);

    $response = $this
        ->actingAs($user)
        ->delete("/posts/{$post->id}");

    $response->assertForbidden(); // 403エラー
    $this->assertDatabaseHas('posts', ['id' => $post->id]); // 投稿が残っている
});
