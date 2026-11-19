<?php

/**
 * Front Controller - Main application entry point
 * 
 * @package Arbor
 */

use Arbor\bootstrap\App;
use Arbor\execution\ExecutionKernel;
use Sys\providers\ConfigProvider;
use Arbor\config\Config;


// Load Composer autoloader
require_once '../vendor/autoload.php';


// Bootstrap and configure the application
$app = (new App())
    ->providers(ConfigProvider::class)
    ->providers(Config::get('sysProviders'))
    ->providers(Config::get('appProviders'))
    ->boot();

// include_once 'test.php';

// handling http
$app->get(ExecutionKernel::class)
    ->http()
    ->send();
