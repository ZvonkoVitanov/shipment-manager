<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'client@posta.mk'],
            [
                'name' => 'Test Client',
                'password' => Hash::make('password'),
                'role' => 'client',
            ]
        );

        Client::updateOrCreate(
            ['user_id' => $user->id],
            [
                'company_name' => 'Test Client Company',
                'contact_person' => 'Test Contact Person',
                'contact_email' => 'client@test.com',
                'contact_phone' => '070123456',
                'company_address' => 'Test Company Address 123',
                'warehouse_location' => 'Test Warehouse Location',
                'default_pickup_location' => 'Test Default Pickup Location',
            ]
        );
    }
}
