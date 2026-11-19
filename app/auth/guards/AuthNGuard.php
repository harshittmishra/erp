<?php

namespace App\auth\guards;

use Arbor\auth\Auth;
use Arbor\http\Response;
use Arbor\http\Respond;
use Arbor\router\Route;
use Throwable;

class AuthNGuard
{
    public function __invoke(
        mixed $input,
        callable $next
    ): Response {
        // Read the session token from the incoming cookie.
        $tokenValue = $input->getCookie('erp_session');

        if (!is_string($tokenValue) || $tokenValue === '') {
            return $this->unauthenticated($input);
        }

        // Validate the token using your Arbor Auth API.
        try {
            $token = Auth::resolve($tokenValue);

            if (!$token) {
                return $this->invalidToken($input);
            }
        } catch (Throwable $e) {
            return Respond::json([
                'success' => false,
                'message' => 'Invalid or expired session',
            ], 401);
        }

        // The token is valid; continue to the next middleware/controller.
        return $next($input);
    }

    protected function unauthenticated(mixed $input): Response
    {
        if ($input->expectsJson()) {
            return Respond::json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        return Respond::redirect(Route::url('login'), 303);
    }

    protected function invalidToken(mixed $input): Response
    {
        if ($input->expectsJson()) {
            return Respond::json([
                'success' => false,
                'message' => 'Invalid or expired session',
            ], 401);
        }

        return Respond::redirect(Route::url('login'), 303);
    }
}
