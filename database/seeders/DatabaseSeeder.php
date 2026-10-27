<?php

namespace Database\\Seeders;

use App\\Models\\User;
use Illuminate\\Database\\Console\\Seeds\\WithoutModelEvents;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([ProductSeeder::class]);
        User::factory()->create([
            'name' => 'Admin Nora',
            'email' => 'admin@lencerianora.com',
            'password' => bcrypt('admin123'),
        ]);
    }
}