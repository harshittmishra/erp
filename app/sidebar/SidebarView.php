<?php

document()->style('sidebar://assets/sidebar.css');
document()->initScript('sidebar://assets/Sidebar.js', 'Sidebar');


/** @var array $data */
extract($data, EXTR_SKIP);

?>

<div id="sidebar">
    <div id="sidebar_close" class="sidebar_close"></div>
    <div class="brand">
        <div class="logo"></div>
        <div class="name">ERP</div>
    </div>

    <?php
    foreach ($options as $option):
        $hasChild = $option->hasChildren();

        $itemClass = 'item';

        if ($hasChild) {
            $itemClass .= ' collapsible';
        }

        $href = '';
        $url = $option->getUrl();

        if ($url) {
            $href = 'href = "' . $url . '"';
        }
    ?>
        <div class="<?= $itemClass ?> <?= $option->getCollapsed() ?>">
            <a <?= $href ?>>
                <div class="title">
                    <div class="icon" style="background-image:url('<?= asset($option->getIcon()) ?>')"></div>
                    <div class="name"><?= $option->getName() ?></div>

                    <?php
                    if ($hasChild) :
                    ?>
                        <div class="caret"></div>
                    <?php endif; ?>

                </div>
            </a>
            <?php
            if ($hasChild) :
            ?>
                <div class="navigation">
                    <ul>
                        <?php
                        foreach ($option->getChildren() as $child) {
                        ?>
                            <a href="<?= $child->getUrl() ?>">
                                <li><span><?= $child->getName() ?></span></li>
                            </a>
                        <?php } ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>

    <?php endforeach; ?>

</div>