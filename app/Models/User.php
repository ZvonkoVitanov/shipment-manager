<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public const ROLE_CLIENT = 'client';
    public const ROLE_SUPER_ADMIN = 'super_admin';
    public const ROLE_OPERATOR = 'operator';


    public function isClient(): bool
    {
        return $this->role === self::ROLE_CLIENT;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }
    public function isOperator(): bool
    {
        return $this->role === self::ROLE_OPERATOR;
    }



    public function isAdmin(): bool
    {
        return in_array($this->role, [
            self::ROLE_SUPER_ADMIN,
        ]);
    }

    public function isStaff(): bool
    {
        return in_array($this->role, [
            self::ROLE_SUPER_ADMIN,
            self::ROLE_OPERATOR,
        ]);
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function changedShipmentStatuses()
    {
        return $this->hasMany(ShipmentStatusHistory::class, 'changed_by_user_id');
    }

    public function assignedShipments()
    {
        return $this->hasMany(Shipment::class, 'operator_id');
    }

}
