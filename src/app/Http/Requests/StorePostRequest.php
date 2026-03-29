<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    // ログイン済みユーザーのみ投稿可能
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    // バリデーションルール
    public function rules(): array
    {
        return [
            'book_title'      => 'required|string|max:255',
            'book_author'     => 'nullable|string|max:255',
            'book_thumbnail'  => 'nullable|url|max:500',
            'google_books_id' => 'nullable|string|max:50',
            'review'          => 'required|string|max:1000',
            'rating'          => 'required|integer|min:1|max:5',
        ];
    }
}
