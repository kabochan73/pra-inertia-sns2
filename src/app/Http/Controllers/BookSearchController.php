<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BookSearchController extends Controller
{
    /**
     * Open Library API を使って本を検索する
     *
     * Google Books API はキーなしだとクォータ制限が厳しいため、
     * 完全無料・APIキー不要の Open Library API を使用する
     *
     * GET /books/search?q=ハリーポッター
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|max:100',
        ]);

        // Open Library 検索 API
        // https://openlibrary.org/dev/docs/api#anchor_searchapi
        $response = Http::get('https://openlibrary.org/search.json', [
            'q'      => $request->q,
            'limit'  => 10,
            'fields' => 'key,title,author_name,cover_i', // 必要なフィールドだけ取得
        ]);

        if ($response->failed()) {
            return response()->json(['books' => []], 200);
        }

        $docs = $response->json('docs') ?? [];

        // フロントに渡す形式に整形
        $books = collect($docs)->map(function (array $doc) {
            // cover_i（表紙ID）があれば Open Library の画像URLを生成する
            // サイズは M（中）を使用
            $thumbnail = isset($doc['cover_i'])
                ? "https://covers.openlibrary.org/b/id/{$doc['cover_i']}-M.jpg"
                : null;

            return [
                // Open Library のキー（例: /works/OL12345W）を ID として使用
                'id'        => $doc['key'] ?? '',
                'title'     => $doc['title'] ?? '',
                // author_name は配列なので「, 」で結合（なければ空文字）
                'author'    => isset($doc['author_name'])
                    ? implode(', ', $doc['author_name'])
                    : '',
                'thumbnail' => $thumbnail,
            ];
        });

        return response()->json(['books' => $books]);
    }
}
