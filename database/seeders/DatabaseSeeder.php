<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([ProductSeeder::class]);

        $email = env('MARBELLIN_ADMIN_EMAIL');
        $password = env('MARBELLIN_ADMIN_PASSWORD');

        if ($email && $password) {
            User::updateOrCreate(
                ['email' => $email],
                ['name' => 'Administración Marbellin', 'password' => Hash::make($password)]
            );
        }
    }
}