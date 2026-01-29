import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(to, subject, content):
    message = Mail(
        from_email='yourapp@example.com',
        to_emails=to,
        subject=subject,
        plain_text_content=content
    )
    sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
    sg.send(message)