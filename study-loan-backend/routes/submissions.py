from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, Submission
from datetime import datetime

submissions_bp = Blueprint('submissions', __name__)

@submissions_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_application():
    try:
        # get_jwt_identity() returns the email string
        user_email = get_jwt_identity()
        print(f"Submitting for user: {user_email}")
        
        user = User.query.filter_by(email=user_email).first()
        if not user:
            print("User not found")
            return jsonify({'error': 'User not found'}), 404
        
        if user.role != 'student':
            print("User is not a student")
            return jsonify({'error': 'Unauthorized'}), 403
        
        student = Student.query.filter_by(user_id=user.id).first()
        if not student:
            print("Student profile not found")
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Create submission
        submission = Submission(
            student_id=student.id,
            submitted_at=datetime.utcnow(),
            status='pending'
        )
        db.session.add(submission)
        db.session.commit()
        
        print("Submission created successfully")
        return jsonify({'message': 'Application submitted successfully'}), 201
    
    except Exception as e:
        print(f"Error in submit_application: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500