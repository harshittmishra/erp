<?php

namespace App\auth\guards;

use Arbor\auth\Auth;
use Arbor\http\Response;
use Arbor\http\Respond;
use Arbor\router\Route;
use Throwable;

class GuestGuard
{
    public function __invoke(
        mixed $input,
        callable $next
    ): Response {

        // Read the session token from the incoming cookie.
        $tokenValue = $input->getCookie('erp_session');

        // No session cookie: this is a guest.
        if (!is_string($tokenValue) || $tokenValue === '') {
            return $next($input);
        }

        // Check whether the existing session is valid.
        try {
            $token = Auth::resolve($tokenValue);

            if ($token) {
                return $this->breakResponse($input);
            }
        } catch (Throwable $e) {
            // Invalid or expired token: treat the request as a guest.
        }

        // Invalid or expired session; allow guest access.
        return $next($input);
    }

    protected function breakResponse(mixed $input): Response
    {
        if ($input->expectsJson()) {
            return Respond::json([
                'success' => false,
                'message' => 'Already authenticated',
            ], 403);
        }

        return Respond::redirect(Route::url('dashboard'), 303);
    }
}
