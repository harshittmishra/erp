<?php

namespace App\login;

use Arbor\container\ServiceProvider;
use App\login\LoginController;
use App\support\ModuleRegistrar;
use Arbor\router\Route;
use Arbor\collections\Collect;


class LoginProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('login', __DIR__);

        Route::groupOptions([
            'middlewares' => Collect::get('guestGuard')
        ])
            ->group(function ($router) {
                $router->get('/', LoginController::class)
                    ->name('login');

                $router->post('/login', [LoginController::class, 'login']);
            });

        Route::post('/logout', [LoginController::class, 'logout'])
            ->middlewares(Collect::get('authGuards'));

        Route::get('/logout', [LoginController::class, 'logout'])
            ->middlewares(Collect::get('authGuards'));
    }
}
