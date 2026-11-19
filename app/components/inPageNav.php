<?php

document()->style('components://assets/css/inPageNav.css', [], 1);

extract($data, EXTR_SKIP);

?>

<div id="inpage_nav" class="collapsible">
    <div class="header">
        <div class="title">Context menu</div>
        <div id="close_context_nav" class="sidebar_close"></div>
    </div>

    <?php foreach ($data as $entry): ?>
        <a href="<?= $entry['url'] ?>">
            <div class="nav_item">
                <h3><?= $entry['label'] ?></h3>
                <p><?= $entry['subLabel'] ?></p>
                <div class="icon"></div>
            </div>
        </a>
    <?php endforeach ?>

</div>