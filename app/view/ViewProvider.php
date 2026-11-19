<?php

namespace App\view;

use App\support\ModuleRegistrar;
use Arbor\container\ServiceProvider;
use Arbor\container\Container;
use Arbor\config\Config;
use Arbor\view\Presenter;
use App\view\DefaultPreset;
use Arbor\collections\Collect;


class ViewProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(Presenter::class, static function () {

            $presenter = new Presenter(
                isDebug: Config::get('root.is_debug'),
                defaultPreset: new DefaultPreset()
            );

            // public schemes
            $presenter->registerScheme(
                'asset',
                Config::get('root.assets_dir'),
                Config::get('root.url') . 'assets'
            );

            $presenter->registerScheme(
                'statics',
                Config::get('root.statics_dir'),
            );

            $presenter->registerScheme(
                'uploads',
                Config::get('root.uploads_dir'),
            );

            return $presenter;
        });
    }

    public function boot(): void
    {
        ModuleRegistrar::register('view', __DIR__);

        Collect::slot('import-map', 'associativeArray');
        Collect::slot('publicApi', 'string');
    }
}
