<?php

use Arbor\view\View;

document()->style('dashboard://assets/css/dashboard.css', [], 10);
document()->style('css/inputs.css');
document()->style('calendar/calendar.css');

document()->initScript('dashboard://assets/js/dashboard.js', 'Dashboard');

View::startComponent('view://layouts/dashboard');

?>

<div id="dashboard">

    <?php
    View::startComponent('components://pageHeader', [
        'title' => 'Dashboard',
        'subtitle' => "Welcome back! here's your business at a glance.",
    ]);

    View::startSlot('actions');
    ?>

    <div id="date-range" class="form-field" style="margin-top:0">
        <input type="text" class="input" placeholder="Date Range">
    </div>

    <?php
    View::endSlot();
    View::endComponent();
    ?>

    <div id="widgets">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-4">
                    <div class="widget_wrapper">
                        <div class="widget">
                            <div class="title_bar">
                                <h3>Sales</h3>
                                <a href="">view report</a>
                            </div>
                            <div class="description">
                                <p>Total value of sales accross all branches</p>
                            </div>
                            <div class="value">
                                <h4>collected</h4>
                                <h3>₹2000.00K</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="widget_wrapper">
                        <div class="widget">
                            <div class="title_bar">
                                <h3>Recievables</h3>
                                <a href="">view report</a>
                            </div>
                            <div class="description">
                                <p>Amount that you're yet to recieve</p>
                            </div>
                            <img src="assets/img/bar-graph.png" alt="" class="img-responsive" draggable="false">
                            <div class="value">
                                <h4>open</h4>
                                <h3>₹0.00</h3>
                            </div>
                            <div class="value">
                                <h4>overdue</h4>
                                <h3>₹0.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="widget_wrapper">
                        <div class="widget">
                            <div class="title_bar">
                                <h3>Payables</h3>
                                <a href="">view report</a>
                            </div>
                            <div class="description">
                                <p>Amount that you're yet to recieve</p>
                            </div>
                            <img src="assets/img/bar-graph.png" alt="" class="img-responsive" draggable="false">
                            <div class="value">
                                <h4>open</h4>
                                <h3>₹0.00</h3>
                            </div>
                            <div class="value">
                                <h4>overdue</h4>
                                <h3>₹0.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <br>
            <br>
            <div class="row">
                <div class="col-sm-8">
                    <div class="widget_wrapper">
                        <div class="widget">
                            <div class="title_bar">
                                <h3>Cash Flow</h3>
                                <a href="">view report</a>
                            </div>
                            <div class="description">
                                <p>Cash coming in and going out of your business</p>
                            </div>
                            <img src="assets/img/candle-graph.png" alt="" class="img-responsive" draggable="false">
                            <div class="value">
                                <h4>incoming</h4>
                                <h3>₹0.00</h3>
                            </div>
                            <div class="value">
                                <h4>outgoing</h4>
                                <h3>₹0.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

<?php View::endComponent(); ?>