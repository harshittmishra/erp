<?php

namespace App\dashboard;

use Arbor\container\ServiceProvider;
use Arbor\router\Route;
use Arbor\collections\Collect;
use App\sidebar\SidebarEntry;
use App\support\ModuleRegistrar;


class DashboardProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('dashboard', __DIR__);

        // route
        Route::get('/dashboard', DashboardController::class)
            ->middlewares(Collect::get('authGuards'))
            ->name('dashboard');

        $this->sidebarEntry();
    }

    public function sidebarEntry()
    {
        $dashboard = (new SidebarEntry('dashboard'))
            ->icon("dashboard://assets/img/dashboard.png")->collapsed(true);

        $dashboard->addChildren(
            'administration',
            Route::url('dashboard')
        );

        $dashboard->addChildren('procurement');
        $dashboard->addChildren('management');

        Collect::add('sidebar', $dashboard);
    }
}
