<?php

namespace App\sidebar;

use Arbor\view\View;
use Arbor\collections\Collect;

class Sidebar
{
    public function __invoke(array $options = [])
    {
        if (empty($options)) {
            $options = Collect::get('sidebar');
        }

        return View::component(
            'sidebar://SidebarView.php',
            ['options' => $options]
        );
    }
}
