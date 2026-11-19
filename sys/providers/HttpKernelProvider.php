<?php

namespace Sys\providers;


use Arbor\container\ServiceProvider;
use Arbor\http\HttpKernel;
use Arbor\config\Config;
use Arbor\container\Container;
use Arbor\pipeline\Pipeline;


class HttpKernelProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(
            HttpKernel::class,
            static function () {

                $kernel = new HttpKernel(
                    Container::make(Pipeline::class)
                );

                // Globale Middlewares.
                $kernel->useMiddlewares(
                    Config::get('middlewares', [])
                );

                return $kernel;
            }
        );
    }

    public function boot(): void
    {
        // Nothing required here for kernel
    }
}
