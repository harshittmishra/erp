<?php

use Arbor\config\Expr;
use Arbor\jsonConfig\jsonConfig;


return [
    'is_debug' => jsonConfig::get('is_debug'),

    'dir' => realpath('../'),

    'url_prefix' => Expr::val(jsonConfig::get('url_prefix'))
        ->call("normalizeUrlSlashes"),

    'url' => Expr::val(jsonConfig::get('url'))
        ->call("normalizeUrlSlashes"),

    'statics_path' => '/statics',

    'uploads_path' => '/uploads',

    'cache_dir' => '/cache',

    'assets_path' => '/assets',

    'assets_dir' => Expr::val('{root.dir}{root.assets_path}')
        ->call('normalizeDirPath'),

    'statics_dir' => Expr::val('{root.dir}{root.statics_path}')
        ->call('normalizeDirPath'),

    'statics_url' => Expr::val('{root.uri}{root.statics_path}')
        ->call('normalizeUrlSlashes'),

    'uploads_dir' => Expr::val('{root.dir}{root.uploads_path}')
        ->call('normalizeDirPath'),

    'uploads_url' => Expr::val('{root.uri}{root.uploads_path}')
        ->call('normalizeUrlSlashes'),

    'keys_dir' => Expr::val('{root.dir}/keys')->call('normalizeDirPath'),

    'assets_url' => Expr::when(
        '{root.is_debug}',
        '{root.url}/app',
        '{root.url}{root.assets_path}/modules'
    )
        ->call('normalizeUrlSlashes'),
];
