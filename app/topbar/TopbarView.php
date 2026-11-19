<?php

document()->style('css/dropdown.css');
document()->style('topbar://assets/topbar.css');
document()->style('select/select.css');
document()->initScript('topbar://assets/Topbar.js', 'Topbar');


extract($data, EXTR_SKIP);

?>
<div id="topbar">
    <div id="sidebar_toggle" class="sidebar_toggle"></div>
    <div id="locationSelector"></div>
    <div id="profileDropdown" class="dropmenu withicons profile_menu">
        <div class="selected" id="profile_menu">
            <span class="avatar" style="background-image:url('profile_pic.jpg')"></span>
            <span class="value">
                <div class="text">
                    <h3>Harshit Mishra</h3>
                    <p>Developer</p>
                </div>
            </span>
            <span class="icon"></span>
        </div>
        <div class="menu">
            <div class="option">
                <span class="icon" style="background-image: url('<?= asset('topbar://assets/img/user_filled.png') ?>');"></span>
                <span class="name">profile</span>
            </div>
            <div class="option">
                <span class="icon" style="background-image: url('<?= asset('topbar://assets/img/setting.png') ?>');"></span>
                <span class="name">settings</span>
            </div>
            <div class="option select">
                <span class="icon" style="background-image: url('<?= asset('topbar://assets/img/sun.png') ?>');"></span>
                <span class="name">Appearance: Light Mode</span>
            </div>
            <hr>
            <div class="option" id="sign-out-btn">
                <span class="icon" style="background-image: url('<?= asset('topbar://assets/img/logout.png') ?>');"></span>
                <span class="name">sign out</span>
            </div>
        </div>
    </div>
</div>