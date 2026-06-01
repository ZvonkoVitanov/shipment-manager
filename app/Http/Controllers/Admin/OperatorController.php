<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class OperatorController extends Controller
{
    public function index()
    {
        $operators = User::where('role', User::ROLE_OPERATOR)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Operators/Index', [
            'operators' => $operators,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Operators/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_OPERATOR,
        ]);

        return redirect()
            ->route('admin.operators.index')
            ->with('success', 'Operator created successfully.');
    }
}
