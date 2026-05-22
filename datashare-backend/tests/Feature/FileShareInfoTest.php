<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileShareInfoTest extends TestCase
{
    use RefreshDatabase;

    public function test_share_info_with_valid_token_returns_metadata(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        $file = File::factory()->for($user)->create([
            'expires_at' => now()->addDay(),
        ]);

        Storage::put($file->path, 'payload');

        $response = $this->getJson("/api/files/share/{$file->token}");

        $response->assertOk()
            ->assertJsonPath('file.original_name', $file->original_name)
            ->assertJsonPath('file.size', $file->size);
    }

    public function test_share_info_with_expired_token_returns_403(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        $file = File::factory()->for($user)->expired()->create();

        Storage::put($file->path, 'payload');

        $response = $this->getJson("/api/files/share/{$file->token}");

        $response->assertForbidden()
            ->assertJson([
                'message' => 'Download link expired',
            ]);
    }

    public function test_share_info_with_unknown_token_returns_404(): void
    {
        $response = $this->getJson('/api/files/share/00000000-0000-0000-0000-000000000000');

        $response->assertNotFound();
    }
}
