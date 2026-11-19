<?php

namespace App\user;

use Arbor\http\Response;
use Arbor\http\Respond;
use Arbor\router\Route;
use Arbor\view\View;


class UserController
{
    public function __invoke(): Response
    {
        $quickNav = [
            [
                'label' => 'New User',
                'subLabel' => 'Create a new user account.',
                'url' => Route::url('users.create')
            ],
            [
                'label' => 'Manage Roles',
                'subLabel' => 'Define roles and access permissions.',
                'url' => Route::url('users.create')
            ],
            [
                'label' => 'Departments',
                'subLabel' => 'Manage departments assigned to users.',
                'url' => ''
            ],
        ];

        return Respond::html(
            View::render('user://views/user', [
                'quickNav' => $quickNav
            ])
        );
    }

    public function create(): Response
    {
        return Respond::html(View::render('user://views/create-user'));
    }
}
