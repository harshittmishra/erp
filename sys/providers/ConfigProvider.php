<?php

namespace Sys\providers;

use Arbor\container\ServiceProvider;
use Arbor\config\Configurator;
use Arbor\container\Container;


class ConfigProvider extends ServiceProvider
{
    public function register(): void
    {
        $config = new Configurator('../configs');
        $config->finalize();

        Container::singleton(Configurator::class, static fn() => $config);
    }
}
