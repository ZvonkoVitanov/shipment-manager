<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OperatorSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'operator@posta.mk'],
            [
                'name' => 'Test Operator',
                'password' => Hash::make('password'),
                'role' => 'operator',
            ]
        );
    }
}
