<?php

namespace App\quickAccess;

use Arbor\view\View;

class QuickAccess
{
    public function __invoke()
    {
        return View::component(
            'quickAccess://QuickAccessView.php',
        );
    }
}
