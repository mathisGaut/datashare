<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FileUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_upload_returns_201_with_metadata(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $uploaded = UploadedFile::fake()->create('report.pdf', 120);

        $response = $this->post('/api/files', [
            'file' => $uploaded,
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'File uploaded successfully')
            ->assertJsonStructure([
                'file' => [
                    'id',
                    'user_id',
                    'original_name',
                    'stored_name',
                    'path',
                    'mime_type',
                    'size',
                    'token',
                    'expires_at',
                ],
                'download_url',
            ]);

        $this->assertSame('report.pdf', $response->json('file.original_name'));
        $this->assertSame($user->id, $response->json('file.user_id'));

        $path = $response->json('file.path');
        Storage::assertExists($path);

        $token = $response->json('file.token');
        $this->assertStringContainsString($token, $response->json('download_url'));
    }
}
