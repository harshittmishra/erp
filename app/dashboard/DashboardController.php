<?php

namespace App\dashboard;

use Arbor\http\Respond;
use Arbor\http\Response;
use Arbor\view\View;


class DashboardController
{
    public function __invoke(): Response
    {
        return Respond::html(View::render('dashboard://views/dashboard', []));
    }
}
