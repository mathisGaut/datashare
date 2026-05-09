<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FileListTest extends TestCase
{
    use RefreshDatabase;

    public function test_files_index_returns_paginated_list(): void
    {
        $user = User::factory()->create();
        File::factory()->count(3)->for($user)->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/files');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'current_page',
                'first_page_url',
                'last_page_url',
                'per_page',
                'total',
            ]);

        $response->assertJsonCount(3, 'data');
        $this->assertSame(10, $response->json('per_page'));
    }
}
