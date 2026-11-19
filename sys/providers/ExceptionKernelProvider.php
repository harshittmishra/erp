<?php

namespace Sys\providers;

use Arbor\container\ServiceProvider;
use Arbor\exception\ExceptionKernel;
use Arbor\config\Config;
use Arbor\container\Container;

class ExceptionKernelProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(
            ExceptionKernel::class,
            static function (): ExceptionKernel {
                return new ExceptionKernel(
                    Config::get('root.is_debug')
                );
            }
        );
    }

    public function boot(): void
    {
        Container::get(ExceptionKernel::class)->bind();
    }
}
