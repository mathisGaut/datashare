<?php

namespace Tests\Unit;

use App\Models\File;
use App\Models\User;
use App\Policies\FilePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilePolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_view_update_and_delete(): void
    {
        $user = User::factory()->create();
        $file = File::factory()->for($user)->create();
        $policy = new FilePolicy;

        $this->assertTrue($policy->view($user, $file));
        $this->assertTrue($policy->update($user, $file));
        $this->assertTrue($policy->delete($user, $file));
    }

    public function test_other_user_cannot_view_update_or_delete(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->create();
        $policy = new FilePolicy;

        $this->assertFalse($policy->view($other, $file));
        $this->assertFalse($policy->update($other, $file));
        $this->assertFalse($policy->delete($other, $file));
    }
}
