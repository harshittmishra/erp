<?php

namespace App\location;

use Arbor\http\Respond;
use Arbor\http\Response;
use Arbor\view\View;

class LocationController
{
    public function __invoke(): Response
    {
        // solve this with template
        return Respond::html(View::render('location://views/location'));
    }
}
