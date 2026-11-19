<?php

namespace Sys\providers;

use Arbor\container\ServiceProvider;
use Arbor\container\Container;
use Arbor\validation\RuleList;
use Arbor\validation\Validator;


class ValidationProvider extends ServiceProvider
{
    protected bool $deferred = true;

    public function register(): void
    {
        Container::singleton(
            Validator::class,
            static function (): Validator {
                $validator = new Validator();

                // register rules.
                $validator->addRule(new RuleList());

                return $validator;
            }
        );
    }

    public function provides(): array
    {
        return [
            Validator::class
        ];
    }
}
