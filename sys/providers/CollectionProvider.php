<?php

namespace Sys\providers;

use Arbor\collections\Collector;
use Arbor\container\ServiceProvider;
use Arbor\container\Container;


class CollectionProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(
            Collector::class,
            static function (): Collector {
                return new Collector();
            }
        );
    }

    public function finalize()
    {
        $collector = Container::get(Collector::class);
        return $collector->finalize();
    }
}
