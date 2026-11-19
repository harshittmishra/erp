<?php

use App\quickAccess\QuickAccess;
use App\topbar\Topbar;
use App\sidebar\Sidebar;
use Arbor\view\View;

document()->initScript(
    'view://assets/js/DashboardLayout.js',
    'DashboardLayout',
    ['sidebar', 'topbar']
);

extract($data, EXTR_SKIP);
?>

<div class="content_wrapper">
    <?= (new QuickAccess())() ?>
    <?= (new Sidebar())() ?>
    <div class="content">
        <?= (new Topbar())() ?>
        <div class="content_inner">
            <?= View::slot() ?>
        </div>
        <?= View::component('components://footer'); ?>
    </div>
</div>