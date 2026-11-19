<?php

use App\view\ViewProvider;
use App\errors\ErrorsProvider;
use App\login\LoginProvider;
use App\auth\AuthProvider;
use App\components\ComponentsProvider;
use App\user\UserProvider;
use App\dashboard\DashboardProvider;
use App\sidebar\SidebarProvider;
use App\quickAccess\QuickAccessProvider;
use App\topbar\TopbarProvider;
use App\location\LocationProvider;

return [
    ViewProvider::class,
    ErrorsProvider::class,
    ComponentsProvider::class,
    SidebarProvider::class,
    QuickAccessProvider::class,
    TopbarProvider::class,
    AuthProvider::class,

    LoginProvider::class,
    DashboardProvider::class,
    UserProvider::class,
    LocationProvider::class,
];
