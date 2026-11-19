<?php

namespace App\auth;

use Arbor\database\orm\Model;

class TokenModel extends Model
{
    protected static string $primaryKey = 'token_id';
    protected static string $tableName = 'tokens';

    protected array $fillable = [
        'token_id',
        'user_id',
        'iat',
        'exp',
    ];
}
