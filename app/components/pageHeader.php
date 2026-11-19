<?php

use Arbor\view\View;

document()->style('css/button.css');
document()->style('components://assets/css/pageHeader.css', [], 1);

extract($data, EXTR_SKIP);
?>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-12">
            <div class="heading_bar clearfix">
                <div class="page-heading">
                    <h3><?= $title ?></h3>
                    <p><?= $subtitle ?></p>
                </div>

                <div class="relative_actions">
                    <?php if (isset($action) && !empty($actionUrl)) : ?>
                        <a href="<?= $actionUrl ?>"><button class="button primary"><?= $action ?></button></a>
                    <?php endif ?>
                    <?= View::slot('actions') ?>
                </div>
            </div>
        </div>
    </div>
</div>