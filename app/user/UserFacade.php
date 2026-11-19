<?php

namespace App\user;

use Arbor\facade\Facade;
use App\user\User;


class UserFacade extends Facade
{
    protected static function getAccessor(): string
    {
        return User::class;
    }
}
