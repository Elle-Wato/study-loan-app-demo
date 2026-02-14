from app import app, db  # Import app and db from app.py
from models import User, Staff  # Import models from models.py
from werkzeug.security import generate_password_hash

with app.app_context():  # Crucial: Wrap in app context for DB operations
    with db.session.begin():
        staff_user = User(
            email='staff@example.com',  # Change to a real email if needed
            password_hash=generate_password_hash('password123'),  # Change to a secure password
            role='staff'
        )
        db.session.add(staff_user)
        db.session.flush()  # Get the user ID after adding
        staff_profile = Staff(user_id=staff_user.id, admin_id=None)  # admin_id is optional
        db.session.add(staff_profile)
    
    print("Staff user created successfully!")