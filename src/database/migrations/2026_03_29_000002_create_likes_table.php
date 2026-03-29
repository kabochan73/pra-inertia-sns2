<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();                                                              // いいねID
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();            // いいねしたユーザー（usersテーブルを参照。ユーザー削除時にいいねも削除）
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();            // いいねされた投稿（postsテーブルを参照。投稿削除時にいいねも削除）
            $table->timestamps();                                                      // 作成日時・更新日時
            $table->unique(['user_id', 'post_id']);                                    // 同じユーザーが同じ投稿に2回いいねできないよう制限
            $table->comment('投稿へのいいね');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
