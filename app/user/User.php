<?php

namespace App\user;

use App\user\UserModel;

class User
{
    public function findByUsername(string $username): ?UserModel
    {
        return UserModel::query()
            ->where('email', '=', $username)
            ->orWhere('contact', '=', $username)
            ->first();
    }
}
