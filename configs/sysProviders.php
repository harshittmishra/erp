<?php

use Sys\providers\DatabaseProvider;
use Sys\providers\HttpKernelProvider;
use Sys\providers\ExceptionKernelProvider;
use Sys\providers\ExecutionKernelProvider;
use Sys\providers\RouterProvider;
use Sys\providers\ScopeProvider;
use Sys\providers\ValidationProvider;
use Sys\providers\CollectionProvider;


/**
 * Service Providers Configuration
 * 
 * ------------------------------------------------------------------------
 * 
 * This configuration array defines the service providers that will be
 * loaded and registered during application bootstrap.
 * Service providers are responsible for binding services into the
 * application's dependency injection container.
 * 
 */

return [
    ExceptionKernelProvider::class,
    ScopeProvider::class,
    ExecutionKernelProvider::class,
    HttpKernelProvider::class,
    CollectionProvider::class,
    RouterProvider::class,
    DatabaseProvider::class,
    ValidationProvider::class,
];
