<?php

namespace App\sidebar;

use Arbor\container\ServiceProvider;
use Arbor\collections\Collect;
use App\support\ModuleRegistrar;


class SidebarProvider extends ServiceProvider
{
    public function register(): void
    {
        // nothing to register
    }

    public function boot(): void
    {
        ModuleRegistrar::register('sidebar', __DIR__);

        Collect::slot(
            'sidebar',
            'instanceOf:App\sidebar\SidebarEntry'
        );
    }
}
