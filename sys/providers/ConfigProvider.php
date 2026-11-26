<?php

namespace Sys\providers;

use Arbor\container\ServiceProvider;
use Arbor\config\Configurator;
use Arbor\container\Container;
use Arbor\jsonConfig\JsonConfigurator;

class ConfigProvider extends ServiceProvider
{
    public function register(): void
    {
        // environment variables.
        $jsonConfig = new JsonConfigurator(
            path: '../env/',
            shouldMerge: true,
            suffix: getenv('ARBOR_APP_ENV') ?: 'production',
        );

        Container::singleton(JsonConfigurator::class, static fn() => $jsonConfig);

        // application configuration.
        $config = new Configurator('../configs');
        $config->finalize();

        Container::singleton(Configurator::class, static fn() => $config);
    }
}
