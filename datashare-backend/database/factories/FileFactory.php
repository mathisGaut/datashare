<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<File>
 */
class FileFactory extends Factory
{
    protected $model = File::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $storedName = Str::uuid()->toString().'.txt';

        return [
            'user_id' => User::factory(),
            'original_name' => 'document.txt',
            'stored_name' => $storedName,
            'path' => 'uploads/'.$storedName,
            'mime_type' => 'text/plain',
            'size' => 100,
            'token' => (string) Str::uuid(),
            'expires_at' => now()->addDays(7),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subHour(),
        ]);
    }
}
