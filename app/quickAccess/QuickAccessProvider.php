<?php

namespace App\quickAccess;

use App\support\ModuleRegistrar;
use Arbor\container\ServiceProvider;


class QuickAccessProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('quickAccess', __DIR__);
    }
}
