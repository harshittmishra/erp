<?php

namespace App\auth;

use Arbor\container\ServiceProvider;
use Arbor\container\Container;
use Arbor\auth\Authenticator;
use Arbor\auth\AuthBuilder;
use App\auth\TokenStore;
use Arbor\collections\Collect;
use App\auth\guards\GuestGuard;
use App\auth\guards\AuthNGuard;
use Arbor\view\View;
use Arbor\config\Config;


class AuthProvider extends ServiceProvider
{
    public function register(): void
    {
        Container::singleton(Authenticator::class, static function () {
            return AuthBuilder::create()
                ->useOpaqueIssuer(86400)
                ->withTokenStore(new TokenStore())
                ->build();
        });
    }

    public function boot(): void
    {
        $assets_url = Config::get('root.assets_url') . '/auth/';

        Collect::add('import-map', ['@auth/' => $assets_url]);

        View::registerScheme(
            'auth',
            __DIR__,
            $assets_url
        );

        // collection keys
        // guards
        Collect::slot('guestGuard', 'fqn', false);
        Collect::slot('authNGuards', 'fqn');
        Collect::slot('authZGuards', 'fqn');
        Collect::slot('resources', 'string');

        // guard groups
        Collect::group('authGuards', ['authNGuards', 'authZGuards']);

        // contribute to guards collection.
        Collect::add('guestGuard', GuestGuard::class);
        Collect::add('authNGuards', AuthNGuard::class);
    }
}
