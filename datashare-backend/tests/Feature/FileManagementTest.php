<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FileManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_files_index(): void
    {
        $this->getJson('/api/files')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_upload(): void
    {
        Storage::fake();

        $file = UploadedFile::fake()->create('x.txt', 10);

        $this->post('/api/files', ['file' => $file])->assertUnauthorized();
    }

    public function test_owner_can_update_file_metadata(): void
    {
        $user = User::factory()->create();
        $file = File::factory()->for($user)->create([
            'original_name' => 'old.txt',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/files/{$file->id}", [
            'original_name' => 'new.txt',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'File updated successfully')
            ->assertJsonPath('file.original_name', 'new.txt');

        $this->assertSame('new.txt', $file->fresh()->original_name);
    }

    public function test_non_owner_cannot_update_file(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->create();

        Sanctum::actingAs($other);

        $this->putJson("/api/files/{$file->id}", [
            'original_name' => 'hacked.txt',
        ])->assertForbidden();
    }

    public function test_owner_can_delete_file(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        $file = File::factory()->for($user)->create();
        Storage::put($file->path, 'x');

        Sanctum::actingAs($user);

        $this->deleteJson("/api/files/{$file->id}")
            ->assertOk()
            ->assertJson(['message' => 'File deleted successfully']);

        $this->assertDatabaseMissing('files', ['id' => $file->id]);
        $this->assertFalse(Storage::exists($file->path));
    }

    public function test_non_owner_cannot_delete_file(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->create();

        Sanctum::actingAs($other);

        $this->deleteJson("/api/files/{$file->id}")->assertForbidden();
    }

    public function test_download_with_unknown_token_returns_404(): void
    {
        $unknownToken = (string) Str::uuid();

        $this->getJson("/api/files/download/{$unknownToken}")
            ->assertNotFound();
    }

    public function test_download_returns_404_when_file_missing_on_disk(): void
    {
        Storage::fake();

        $user = User::factory()->create();
        $file = File::factory()->for($user)->create([
            'expires_at' => now()->addDay(),
        ]);

        $this->assertFalse(Storage::exists($file->path));

        $this->getJson("/api/files/download/{$file->token}")
            ->assertNotFound()
            ->assertJson(['message' => 'File not found']);
    }

    public function test_files_index_supports_search_query(): void
    {
        $user = User::factory()->create();
        File::factory()->for($user)->create(['original_name' => 'report-q1.pdf']);
        File::factory()->for($user)->create(['original_name' => 'notes.txt']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/files?search=report');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertStringContainsString('report', $response->json('data.0.original_name'));
    }

    public function test_files_index_rejects_invalid_sort_and_defaults(): void
    {
        $user = User::factory()->create();
        File::factory()->for($user)->create(['original_name' => 'a.txt']);
        File::factory()->for($user)->create(['original_name' => 'b.txt']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/files?sort=invalid_column');

        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }
}
