<?php

use Arbor\view\View;

document()->style('css/button.css', [], 10);
document()->style('css/inputs.css', [], 10);
document()->style('dropUpload/dropUpload.css', [], 10);

document()->initScript('user://assets/js/User.js');

View::startComponent('view://layouts/dashboard');

?>

<?= View::component('components://pageHeader', [
    'title' => 'Create User',
    'subtitle' => '',
]);
?>

<div class="container-fluid">
    <div class="row no-pad">
        <div class="col-sm-8">

            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-heading">
                            <h3>General</h3>
                            <p>Create a new system user and assign their role and accessible business locations.</p>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <div class="form-field">
                            <label class="form-label is-required">
                                Name
                            </label>
                            <input type="text" class="input" placeholder="User's full name">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-8">
                        <div class="form-field">
                            <div class="form-label is-required">
                                Designation
                            </div>
                            <input type="text" class="input" placeholder="Employee's Designation">
                        </div>
                        <div class="form-field">
                            <label class="form-label is-required">
                                Employee's ID
                            </label>
                            <input type="text" class="input" placeholder="User's full name">
                        </div>
                        <div class="form-field">
                            <label class="form-label is-required">
                                Status
                            </label>
                            <select name="" id="" class="input">
                                <option value="">Active</option>
                                <option value="">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label class="form-label">
                            Profile Pic
                        </label>
                        <div id="avatar-uploader" class="drop-upload">
                            <input type="file" class="drop-upload-input" accept="image/*">
                            <div class="placeholder">
                                <span class="bg"></span>
                                <span class="title">Drag & Drop file to upload here..</span>
                                <span class="or">OR</span>
                                <button class="button primary">upload</button>
                            </div>
                        </div>
                        <div id="avatar-container"></div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="row no-pad">
        <div class="col-sm-8">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-heading">
                            <h3>Login Credentials</h3>
                            <p>These credentials will be used to access the ERP.</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-field">
                            <label class="form-label is-required">
                                Email
                            </label>
                            <input type="text" class="input" placeholder="Email ID">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-field">
                            <label class="form-label is-required">
                                Contact Number
                            </label>
                            <input type="text" class="input" placeholder="Contact Number">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-field">
                            <label class="form-label is-required">
                                Password
                            </label>
                            <input type="password" class="input" placeholder="Password">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-field">
                            <label class="form-label is-required">
                                Confirm Password
                            </label>
                            <input type="password" class="input" placeholder="Re-enter Password to verify">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-8">
            <hr>
            <div class="form-controls right">
                <button class="button secondary">cancel</button>
                <button class="button primary">Save</button>
            </div>
        </div>
    </div>

</div>

<?= View::endComponent(); ?>