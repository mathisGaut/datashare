<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileDownloadTest extends TestCase
{
    use RefreshDatabase;

    public function test_download_with_valid_token_returns_file(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        $file = File::factory()->for($user)->create([
            'expires_at' => now()->addDay(),
        ]);

        Storage::put($file->path, 'payload-bytes');

        $response = $this->get("/api/files/download/{$file->token}");

        $response->assertOk();
        $this->assertStringContainsString(
            'attachment',
            (string) $response->headers->get('content-disposition')
        );
        $this->assertSame(
            'payload-bytes',
            Storage::get($file->path)
        );
    }

    public function test_download_with_expired_token_returns_403(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        $file = File::factory()->for($user)->expired()->create();

        Storage::put($file->path, 'should-not-download');

        $response = $this->getJson("/api/files/download/{$file->token}");

        $response->assertForbidden()
            ->assertJson([
                'message' => 'Download link expired',
            ]);
    }
}
