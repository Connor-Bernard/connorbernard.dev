/**
 * Contact Page Handler
 */

<?php
#TODO: clean user input
$userFirstName = $_POST["firstName"];
$userLastName = $_POST["lastName"];
$user_email = $_POST["email"]; #TODO: Make sure this matches regex syntax
$message = $_POST["message"];
$email_from = "connorbernard@berkeley.edu";
$email_subject = "PORTFOLIO MESSAGE";
$email_body = "User: $user_name\nUser email: $user_email\nMessage: $message\n";
$sent = @mail("connorbernard@berkeley.edu", $email_subject, $email_body);
header("Location: /index.html#contact?submitted=$sent");
?>