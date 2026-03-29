<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                                                              // 投稿ID
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();            // 投稿したユーザー（usersテーブルを参照。ユーザー削除時に投稿も削除）
            $table->string('book_title');                                              // 本のタイトル
            $table->string('book_author')->nullable();                                 // 著者名（Google Booksに情報がない場合はnull）
            $table->string('book_thumbnail')->nullable();                              // 表紙画像のURL（Google Booksから取得）
            $table->string('google_books_id')->nullable();                             // Google BooksのID（書籍の一意識別子）
            $table->text('review');                                                    // 感想・レビュー本文
            $table->unsignedTinyInteger('rating');                                     // 評価（1〜5の整数）
            $table->timestamps();                                                      // 作成日時・更新日時
            $table->comment('読んだ本の投稿');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
