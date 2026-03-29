<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'    => User::factory(), // テスト用ユーザーを自動生成
            'book_title' => $this->faker->sentence(3),
            'book_author' => $this->faker->name(),
            'review'     => $this->faker->paragraph(),
            'rating'     => $this->faker->numberBetween(1, 5),
        ];
    }
}
