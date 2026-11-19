<?php

namespace Sys\providers;

use Arbor\container\ServiceProvider;
use Arbor\execution\ExecutionKernel;
use Arbor\container\Container;

class ExecutionKernelProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(
            ExecutionKernel::class,
            static function (): ExecutionKernel {
                return new ExecutionKernel();
            }
        );
    }

    public function boot(): void
    {
        // ExecutionKernel does not require any boot-time initialization.
    }
}
