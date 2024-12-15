<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Recipient email address
    $to = "poornachandrapc7777@gmail.com";
    
    // Email subject
    $subject = "New Message from $name";
    
    // Email body
    $body = "You have received a new message from your website contact form:\n\n".
            "Name: $name\n".
            "Email: $email\n".
            "Message:\n$message";

    // Email headers
    $headers = "From: $email" . "\r\n" . 
               "Reply-To: $email" . "\r\n" . 
               "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "<script>alert('Message sent successfully!'); window.location.href='contact.html';</script>";
    } else {
        echo "<script>alert('Failed to send message. Please try again later.'); window.location.href='contact.html';</script>";
    }
}
?>
