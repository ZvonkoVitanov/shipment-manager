<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with('user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Clients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],

            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],

            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],

            'company_address' => ['nullable', 'string', 'max:255'],
            'warehouse_location' => ['nullable', 'string', 'max:255'],
            'default_pickup_location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['company_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_CLIENT,
        ]);

        Client::create([
            'user_id' => $user->id,
            'company_name' => $validated['company_name'],
            'contact_person' => $validated['contact_person'] ?? null,
            'contact_email' => $validated['contact_email'] ?? null,
            'contact_phone' => $validated['contact_phone'] ?? null,
            'company_address' => $validated['company_address'] ?? null,
            'warehouse_location' => $validated['warehouse_location'] ?? null,
            'default_pickup_location' => $validated['default_pickup_location'] ?? null,
        ]);

        return redirect()
            ->route('admin.clients.index')
            ->with('success', 'Client created successfully.');
    }
}
