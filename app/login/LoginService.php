<?php

namespace App\login;

use Arbor\http\RequestContext;
use App\user\UserFacade;
use Arbor\auth\authentication\Token;
use Arbor\auth\Auth;
use Arbor\scope\Scope;
use Arbor\auth\AuthContext;
use Exception;

class LoginService
{
    public function login(RequestContext $request): ?Token
    {
        $data = $request->getParsedBody();

        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $user = UserFacade::findByUsername($username);

        if (
            !$user ||
            !password_verify($password, $user->password)
        ) {
            return null;
        }

        return Auth::issueToken([
            'user_id' => $user->user_id,
        ]);
    }

    public function logout(): bool
    {
        $authContext = Scope::get(AuthContext::class);

        if (!$authContext) {
            throw new Exception("no session exist", 1);
        }

        Auth::revoke($authContext);

        return true;
    }
}
