from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, Submission
from datetime import datetime
import json

submissions_bp = Blueprint('submissions', __name__)

@submissions_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_application():
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if user.role != 'student':
            return jsonify({'error': 'Unauthorized'}), 403

        student = Student.query.filter_by(user_id=user.id).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404

        data = request.get_json()

        # Load existing student.details JSON or empty dict
        details = student.details or {}
        if isinstance(details, str):
            try:
                details = json.loads(details)
            except Exception:
                details = {}

        # Merge/update new submission data into existing details
        # Monthly submission might contain all or partial keys. Here we merge instead of overwrite
        # Presuming the frontend sends full application data except for consent form
        # Also merge consent data separately if sent during the consent step
        consent_data = {
            'studentName': data.get('studentName'),
            'studentDate': data.get('studentDate'),
            'studentSignature': data.get('studentSignature'),
            'guardianName': data.get('guardianName'),
            'guardianDate': data.get('guardianDate'),
            'guardianSignature': data.get('guardianSignature'),
            'guarantorName': data.get('guarantorName'),
            'guarantorDate': data.get('guarantorDate'),
            'guarantorSignature': data.get('guarantorSignature')
        }

        # Remove keys not related to consent to merge them separately if any
        main_data_keys = set(data.keys()) - set(consent_data.keys())

        # Update main application details (merge nested dicts)
        for key in main_data_keys:
            details[key] = data[key]

        # Update consent form separately, overwriting consent only
        details['consentForm'] = consent_data

        # Update student name if missing or different
        student_name = consent_data.get('studentName') or details.get('personalDetails', {}).get('fullName') or student.name
        if student_name and student_name != student.name:
            student.name = student_name

        student.details = details

        # Create new submission record
        submission = Submission(
            student_id=student.id,
            submitted_at=datetime.utcnow(),
            status='pending'
        )

        db.session.add(student)
        db.session.add(submission)
        db.session.commit()

        return jsonify({'message': 'Application submitted successfully'}), 201

    except Exception as e:
        db.session.rollback()
        print("Submission error:", str(e))
        return jsonify({'error': 'Internal server error'}), 500