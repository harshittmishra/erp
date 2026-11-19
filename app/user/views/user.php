<?php

use Arbor\view\View;

document()->style('css/table.css', [], 10);

View::startComponent('view://layouts/dashboard');

extract($data, EXTR_SKIP);
?>

<?= View::component('components://pageHeader', [
    'title' => 'Users',
    'subtitle' => 'Manage employees who can access the system.',
]) ?>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-8">
            <table class="tbl titledCards">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Assigned Location</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">User</div>
                                <div class="tbl-value">
                                    <p class="title">Rahul Sharma</p>
                                    <p>EMP0012</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Contact</div>
                                <div class="tbl-value">
                                    <p>rahul@company.com</p>
                                    <p>9876543210</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Role</div>
                                <div class="tbl-value">
                                    Sales Manager
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Assigned Location</div>
                                <div class="tbl-value">
                                    Rawls Warehouse
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Status</div>
                                <div class="tbl-value">
                                    Active
                                </div>
                            </div>
                        </td>

                    </tr>

                    <tr>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">User</div>
                                <div class="tbl-value">
                                    <p class="title">Priya Verma</p>
                                    <p>EMP0015</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Contact</div>
                                <div class="tbl-value">
                                    <p>priya@company.com</p>
                                    <p>8520963741</p>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Role</div>
                                <div class="tbl-value">
                                    Inventory Executive
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Assigned Location</div>
                                <div class="tbl-value">
                                    Head Office
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="tbl-cell">
                                <div class="tbl-label">Status</div>
                                <div class="tbl-value">
                                    Active
                                </div>
                            </div>
                        </td>

                    </tr>

                </tbody>
            </table>
        </div>

        <div class="col-sm-4">
            <?= View::component('components://inPageNav', $quickNav) ?>
        </div>
    </div>
</div>


<?php View::endComponent(); ?>