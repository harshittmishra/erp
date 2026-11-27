<?php

namespace App\view;

use Arbor\collections\Collect;
use Arbor\view\presets\PresetInterface;
use Arbor\view\Document;
use Arbor\config\Config;


class DefaultPreset implements PresetInterface
{
    public function apply(Document $doc): void
    {
        $doc->meta([
            'name' => 'viewport',
            'content' => 'width=device-width',
            'intial-scale' => '1.0'
        ]);

        $doc->style('css/base.css');
        $doc->style('css/reset.css');
        $doc->style('css/grid.css');
        $doc->style('css/common.css');

        $doc->link(['rel' => 'preconnect', 'src' => 'https://fonts.googleapis.com']);
        $doc->link(['rel' => 'preconnect', 'src' => 'https://fonts.gstatic.com', 'crossorigin' => '']);
        $doc->style('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');


        Collect::add('import-map', [
            'assets/' => Config::get('root.url') . 'assets/',
        ]);

        $this->injectImportMap($doc);
        $this->injectConfig($doc);

        $doc->initScript('view://assets/js/ApiInterceptor.js');
    }

    protected function injectConfig(Document $doc)
    {
        $config = [
            'baseUrl'     => Config::get('root.url'),
            'staticsPath' => Config::get('root.statics_url'),
            'publicApi' => Collect::get('publicApi'),
            'landingPage' => 'dashboard'
        ];

        $encoded = base64_encode(json_encode($config, JSON_THROW_ON_ERROR));

        $doc->headInlineScript('window.__app__ = "' . $encoded . '";');
    }

    protected function injectImportMap(Document $doc): void
    {
        foreach (Collect::get('import-map') as $import) {
            $doc->importMap($import);
        }
    }
}
