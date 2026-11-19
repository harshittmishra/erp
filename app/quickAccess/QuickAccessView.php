<?php

document()->style('quickAccess://assets/quickAccess.css');

?>
<div id="quick_access">
    <div class="inner">
        <div class="item">
            <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/ai.png') ?>')"></div>
            <span class="tool_tip">A.I. Assistant</span>
        </div>
        <div class="item">
            <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/recent.png') ?>')"></div>
            <span class="tool_tip">recently access</span>
        </div>
        <div class="item" id="notifications">
            <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/notification.png') ?>')"></div>
            <div class="counter">3</div>
            <span class="tool_tip">notifications</span>
            <div class="menu notifications">
                <div class="menu_title">
                    <h3>Notifications</h3>
                </div>
                <div class="list_item new">
                    <div class="text">
                        <h3>Version 2.3.0 is available. Read the <a href="">release notes</a>.</h3>
                        <p>Update now to access the latest features and improvements.</p>
                    </div>
                </div>

                <div class="list_item new">
                    <div class="text">
                        <h3>Low stock alert for 8 products.</h3>
                        <p>Review inventory levels and create purchase orders if required.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>5 purchase invoices are awaiting approval.</h3>
                        <p>Approve or reject pending documents to continue processing.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>Today's sales have crossed ₹1,50,000.</h3>
                        <p>Revenue is 18% higher than yesterday.</p>
                    </div>
                </div>

                <div class="list_item new">
                    <div class="text">
                        <h3>Monthly GST report is ready.</h3>
                        <p>You can review and export it before filing.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>Database backup completed successfully.</h3>
                        <p>Your latest backup was created today at 02:15 AM.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>New user "Aditi Sharma" joined the Sales team.</h3>
                        <p>Assign roles and location access before first login.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>2 customers have overdue invoices.</h3>
                        <p>Follow up to avoid delays in payment collection.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>Server maintenance is scheduled for <b>Sunday 16-08-2026 12:55pm</b> </h3>
                        <p>Expected downtime is approximately 15 minutes.</p>
                    </div>
                </div>

                <div class="list_item">
                    <div class="text">
                        <h3>Your trial expires in 12 days.</h3>
                        <p>Upgrade your subscription to continue uninterrupted access.</p>
                    </div>
                </div>

            </div>
        </div>
        <div class="item" id="new_entry">
            <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/new.png') ?>')"></div>
            <span class="tool_tip">New entry</span>
            <div class="menu">
                <a href="invoice.php">
                    <div class="option">Sale invoice</div>
                </a>
                <a href="bill.php">
                    <div class="option">Purchase bill</div>
                </a>
                <a href="add-customer.php">
                    <div class="option">Customer</div>
                </a>
                <a href="add-vendor.php">
                    <div class="option">Vendor</div>
                </a>
                <a href="add-product.php">
                    <div class="option">Product</div>
                </a>
            </div>
        </div>
        <div class="item" id="tasks">
            <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/checklist.png') ?>')"></div>
            <span class="tool_tip">tasks</span>
            <div class="menu checkable tasks">
                <div class="menu_title">
                    <h3>Tasks</h3>
                    <span class="shortcut"></span>
                </div>
                <div class="list_item">
                    <div class="check"></div>
                    <div class="text">
                        <h3>update the rawls website</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur</p>
                    </div>
                </div>
                <div class="list_item">
                    <div class="check"></div>
                    <div class="text">
                        <h3>Present demo</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="item" id="chats">
            <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/chat.png') ?>')"></div>
            <span class="tool_tip">tickets</span>

            <div class="menu chats">
                <div class="list_item">
                    <div class="text">
                        <h3>Harshit Mishra</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur</p>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <span class="section_title">
            <span class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/pin.png') ?>')"></span>
            pins
        </span>
        <a href="list-catalog.php">
            <div class="item">
                <div class="icon" style="background-image:url('<?= asset('quickAccess://assets/img/inventory.png') ?>')"></div>
                <span class="tool_tip">inventory</span>
            </div>
        </a>
    </div>
</div>