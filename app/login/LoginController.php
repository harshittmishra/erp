<?php

namespace App\login;

use Arbor\http\Respond;
use Arbor\http\Response;
use Arbor\http\RequestContext;
use Arbor\view\View;
use Exception;

class LoginController
{
    protected LoginService $service;

    public function __construct()
    {
        $this->service = new LoginService();
    }

    public function __invoke()
    {
        return Respond::html(
            View::render('login://views/login.php')
        );
    }

    public function login(RequestContext $input): Response
    {
        $token = $this->service->login($input);

        if (!$token) {
            return Respond::json(
                ['error' => 'invalid credentials'],
                401
            );
        }

        return Respond::json([
            'success' => true,
            'message' => 'login successful',
        ])
            ->withCookie(
                'erp_session',
                $token->value(),
                [
                    'path' => '/',
                    'max_age' => 86400,
                    'expires' => time() + 86400,
                    'httponly' => true,
                    'secure' => $input->isSecure(),
                    'samesite' => 'Lax',
                ]
            );
    }

    public function logout(RequestContext $input): Response
    {
        try {
            $this->service->logout();

            return Respond::json([
                'success' => true,
                'message' => 'logged out successfully',
            ])
                ->withoutCookie('erp_session', [
                    'path' => '/',
                    'httponly' => true,
                    'secure' => $input->isSecure(),
                    'samesite' => 'Lax',
                ]);
        } catch (Exception $ex) {
            return Respond::json(
                ['success' => false, 'message' => 'no session to logout']
            );
        }
    }
}
