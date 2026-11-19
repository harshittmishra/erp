<?php

use Arbor\view\View;
use Arbor\router\Route;

document()->style('css/table.css', [], 10);

View::startComponent('view://layouts/dashboard');

?>

<?= View::component('components://pageHeader', [
    'title' => 'Locations',
    'subtitle' => 'manage physical locations of this business',
    'action' => 'New Location',
    'actionUrl' => Route::url('new-location'),
]) ?>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-12">
            <!-- list -->
            <table class="tbl titledCards">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Contact Person</th>
                        <th>Contact Number</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Name</div>
                                <div class="tbl-value">
                                    <p class="title">Rawls Warehouse</p>
                                    <p>00369</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Address</div>
                                <div class="tbl-value">
                                    <p>568, udyog vihar, phase 5, gurugram - 122022</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Contact Person</div>
                                <div class="tbl-value">
                                    Atul
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Contact Number</div>
                                <div class="tbl-value">
                                    9876543210
                                </div>
                            </div>
                        </td>

                    </tr>

                    <tr>
                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Name</div>
                                <div class="tbl-value">
                                    <p class="title">Rawls H/o</p>
                                    <p>00340</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Address</div>
                                <div class="tbl-value">
                                    <p>463, udyog vihar, phase 5, gurugram - 122022</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Contact Person</div>
                                <div class="tbl-value">
                                    Aditi
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Updated At</div>
                                <div class="tbl-value">
                                    8520963741
                                </div>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php View::endComponent(); ?>