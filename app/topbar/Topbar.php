<?php

namespace App\topbar;

use Arbor\view\View;

class Topbar
{
    public function __invoke()
    {
        $user =  [
            'name' => 'harshit mishra',
            'designation' => 'developer',
            'profile_pic' => '',
        ];

        $locations = [
            'location_name' => [
                'name' => '',
                'type' => '',
                'icon' => ''
            ]
        ];

        return View::component(
            'topbar://TopbarView.php',
            [
                'user' => $user,
                'locations' => $locations
            ]
        );
    }
}
