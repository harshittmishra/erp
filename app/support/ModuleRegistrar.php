<?php

namespace App\support;

use Arbor\view\View;
use Arbor\config\Config;
use Arbor\collections\Collect;

class ModuleRegistrar
{
    public static function register(string $folder, string $path): void
    {
        $assets_url = Config::get('root.assets_url') . "/{$folder}/";

        Collect::add('import-map', [
            "@{$folder}/" => $assets_url
        ]);

        View::registerScheme(
            $folder,
            $path,
            $assets_url
        );
    }
}
