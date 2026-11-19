<?php

namespace Sys\providers;

use Arbor\config\Config;
use Arbor\container\ServiceProvider;
use Arbor\router\Router;
use Arbor\container\Container;
use Arbor\pipeline\Pipeline;


/**
 * Class RouterProvider
 *
 * This service provider is responsible for registering and configuring the Router
 * service within the application. It handles the creation of the Router instance,
 * loading route definitions from configuration files, and setting up error pages.
 *
 * Note: This provider CANNOT be deferred since routes need to be registered 
 * during the boot process.
 *
 * @package Arbor\providers
 * 
 */
class RouterProvider extends ServiceProvider
{
    /**
     * Register the Router service as a singleton in the container.
     *
     * @return void
     */
    public function register(): void
    {
        Container::singleton(
            Router::class,
            static function (): Router {
                return new Router(
                    new Pipeline(),
                    Config::get('root.url')
                );
            }
        );
    }

    public function boot(): void {}
}
