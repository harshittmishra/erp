<?php

document()->style('owl-carousel/owl-carousel.css');
document()->style('owl-carousel/owl-theme.css');
document()->style('css/button.css');
document()->style('css/inputs.css');
document()->style('css/toggles.css');
document()->style('notify/notify.css');
document()->style('login://assets/css/login.css');

document()->script('jq/jq.js');
document()->script('owl-carousel/owl-carousel.js');
document()->initScript('login://assets/js/login.js', 'Login');

?>
<div id="login">
    <div class="inner">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div class="login_page intro active">
                        <div class="brand">
                            <div class="logo"></div>
                            <div class="name">ERP</div>
                        </div>
                        <div class="owl-carousel login-carousel">
                            <div class="item">
                                <div class="bg" style="background-image: url('<?= asset('login://assets/img/invoice_il.png') ?>');"></div>
                                <div class="head">
                                    <h3>Invoices</h3>
                                    <p>Create professional invoices and get paid faster.</p>
                                </div>
                            </div>

                            <div class="item">
                                <div class="bg" style="background-image: url('<?= asset('login://assets/img/1311512_602.jpg') ?>');"></div>
                                <div class="head">
                                    <h3>Reports</h3>
                                    <p>Gain valuable insights with clear business reports.</p>
                                </div>
                            </div>

                            <div class="item">
                                <div class="bg" style="background-image: url('<?= asset('login://assets/img/22428583_550.jpg') ?>');"></div>
                                <div class="head">
                                    <h3>Track</h3>
                                    <p>Monitor purchases, expenses, and inventory with ease.</p>
                                </div>
                            </div>
                        </div>
                        <button class="button primary block" id="get_started_button">Get started</button>
                    </div>
                </div>
                <div class="col-sm-1"></div>
                <div class="col-sm-5">
                    <div class="login_page form">
                        <form id="login-form">
                            <div class="login_form">
                                <div class="heading">
                                    <div class="logo"></div>
                                    <div class="title">Login to start your session</div>
                                </div>

                                <div class="form-field">
                                    <label class="form-label is-required">
                                        Email
                                    </label>
                                    <input type="text" class="input" placeholder="Your Email Id" name="username">
                                </div>
                                <div class="form-field">
                                    <label class="form-label is-required">
                                        Password
                                    </label>
                                    <input type="password" class="input" placeholder="your Password" name="password">
                                </div>
                                <div class="container-fluid">
                                    <div class="row no-pad">
                                        <div class="col-sm-6">
                                            <div class="form-field">
                                                <label class="checkbox align-top">
                                                    <input type="checkbox" name="remember">
                                                    <span class="checkbox-box"></span>
                                                    <span class="checkbox-label small">
                                                        Remember this device
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-field">
                                                <label class="checkbox align-right">
                                                    <span class="checkbox-label small">
                                                        <a href="">Forgot password ?</a>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-field">
                                            <label class="checkbox align-top">
                                                <input type="checkbox" name="terms-acceptance">
                                                <span class="checkbox-box"></span>
                                                <span class="checkbox-label small">
                                                    By continuing, I agree to <a href="#">Company Name</a>'s
                                                    <a href="#" class="colored-anchor">Terms of Service</a> and
                                                    <a href="#" class="colored-anchor">Privacy Policy</a>.
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="input_group"></div>
                                <div class="input_group">
                                    <button id="login-btn" class="button primary block">Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>