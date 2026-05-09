<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FilePolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_view_another_users_file(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->create();

        Sanctum::actingAs($other);

        $response = $this->getJson("/api/files/{$file->id}");

        $response->assertForbidden();
    }
}
