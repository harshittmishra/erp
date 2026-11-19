<?php

namespace App\errors;

use Arbor\container\ServiceProvider;
use Arbor\router\Route;
use Arbor\http\Respond;
use Arbor\view\View;


class ErrorsProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        View::registerScheme('errors', __DIR__ . '/views');

        Route::error()->any(404, static function () {
            return Respond::html(View::render('errors://not-found.php'));
        });

        Route::error()->any(405, static function () {
            return Respond::html(View::render('errors://method-not-allowed.php'));
        });

        Route::error()->any(500, static function () {
            return Respond::html(View::render('errors://something-wrong.php'));
        });
    }
}
