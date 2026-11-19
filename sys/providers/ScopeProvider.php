<?php

namespace Sys\providers;

use Arbor\container\ServiceProvider;
use Arbor\scope\Scoper;
use Arbor\scope\Stack;
use Arbor\container\Container;

class ScopeProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(
            Scoper::class,
            static function (): Scoper {
                return new Scoper(
                    new Stack()
                );
            }
        );
    }

    public function boot(): void
    {
        // Scope does not require any boot-time initialization.
    }
}
