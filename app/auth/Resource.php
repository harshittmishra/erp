<?php

namespace App\services\auth;

use Arbor\auth\authorization\ResourceInterface;
use Arbor\auth\authorization\AuthEnumTrait;


enum Resource: string implements ResourceInterface
{
    use AuthEnumTrait;

    case POST = 'post';
    case LEADS = 'leads';
}
