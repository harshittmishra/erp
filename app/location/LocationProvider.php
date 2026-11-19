<?php

namespace App\location;

use Arbor\container\ServiceProvider;
use Arbor\router\Route;
use Arbor\collections\Collect;
use App\support\ModuleRegistrar;
use App\location\LocationController;
use App\sidebar\SidebarEntry;


class LocationProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('location', __DIR__);

        // route
        Route::get('/location', LocationController::class)
            ->middlewares(Collect::get('authGuards'))
            ->name('location');

        Route::get('/location-new', LocationController::class)
            ->middlewares(Collect::get('authGuards'))
            ->name('new-location');

        $this->sidebarEntry();
    }

    public function sidebarEntry()
    {
        $entry = (new SidebarEntry('locations', Route::url('location')))
            ->icon("location://assets/img/location.png")->collapsed(true);

        Collect::add('sidebar', $entry);
    }
}
