<?php

use Arbor\jsonConfig\jsonConfig;

return [

    /**
     * Default Pool Settings
     * 
     * Users can override these per connection if needed.
     */
    'maxRetries' => 3,
    'retryDelay' => 1000, // milliseconds

    /**
     * Database Connections
     * 
     * Each key is a connection name. Users can optionally override
     * pool settings per connection.
     * 
     */
    'connections' => [

        'main' => [
            'driver'       => 'mysql',
            'host'         => jsonConfig::get('database.host'),
            'databaseName' => jsonConfig::get('database.name'),
            'username'     => jsonConfig::get('database.username'),
            'password'     => jsonConfig::get('database.password'),
        ],

    ],

];
