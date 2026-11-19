<?php

namespace App\user;

use Arbor\database\orm\Model;

class UserModel extends Model
{
    protected static string $tableName = 'users';

    protected array $fillable = [
        'name',
        'contact',
        'email',
        'username',
        'password',
        'is_active',
        'email_verified_at',
        'last_login_at',
        'last_login_ip',
    ];

    // mutators
    protected function setPasswordAttribute(string $value): string
    {
        return password_hash($value, PASSWORD_DEFAULT);
    }

    protected function setNameAttribute(string $value): string
    {
        return ucwords($value);
    }
}
