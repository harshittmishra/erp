<?php

namespace App\components;

use Arbor\container\ServiceProvider;
use App\support\ModuleRegistrar;


class ComponentsProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('components', __DIR__);
    }
}
