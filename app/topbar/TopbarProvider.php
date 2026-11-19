<?php

namespace App\topbar;

use Arbor\container\ServiceProvider;
use App\support\ModuleRegistrar;


class TopbarProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('topbar', __DIR__);
    }
}
