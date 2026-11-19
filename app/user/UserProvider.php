<?php

namespace App\user;


use Arbor\container\ServiceProvider;
use Arbor\router\Route;
use Arbor\collections\Collect;
use App\sidebar\SidebarEntry;
use App\support\ModuleRegistrar;
use App\user\UserController;


final class UserProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        ModuleRegistrar::register('user', __DIR__);

        $this->viewRoutes();
        $this->apiRoutes();

        // Collect::add('quickAccess', ['New User' => Route::url('new_user')]);

        $this->sidebarEntry();
    }

    private function viewRoutes()
    {
        Route::get('/users', UserController::class)
            ->name('users');

        Route::get('/users/{id}', UserController::class)
            ->name('users.show');

        Route::get('/users/create', [UserController::class, 'create'])
            ->name('users.create');
    }

    private function apiRoutes()
    {
        Route::get('/api/users', UserApi::class)
            ->name('api.users');
    }

    private function sidebarEntry()
    {
        $entry = (new SidebarEntry('users', Route::url('users')))
            ->icon("user://assets/img/user.png")->collapsed(true);

        Collect::add('sidebar', $entry);
    }
}
