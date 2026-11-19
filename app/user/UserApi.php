<?php

namespace App\user;

use Arbor\http\Response;
use Arbor\http\RequestContext;
use Arbor\http\Respond;


class UserApi
{
    public function __invoke()
    {
        // returns json list of all users
    }

    public function create(RequestContext $input): Response
    {
        $data = $input->getParsedBody();

        return Respond::json(['user' => 1]);
    }
}
