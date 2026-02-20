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

        # ── Check if student already has a locked/submitted application ──
        existing_submission = Submission.query.filter_by(
            student_id=student.id,
            is_locked=True
        ).first()

        if existing_submission:
            # Student already has a locked submission
            # Create a BRAND NEW student profile snapshot for the new application

            # Build fresh details from new data
            new_details = {}
            consent_data = build_consent_data(data)
            main_data_keys = set(data.keys()) - set(consent_data.keys())

            for key in main_data_keys:
                new_details[key] = data[key]

            new_details['consentForm'] = consent_data

            # Get student name from new data
            new_student_name = (
                consent_data.get('studentName') or
                new_details.get('personalDetails', {}).get('fullName') or
                student.name
            )

            # Create a NEW student record for this new application
            new_student = Student(
                user_id=user.id,
                name=new_student_name,
                details=new_details
            )
            db.session.add(new_student)
            db.session.flush()  # get new_student.id before commit

            # Create new submission linked to new student
            new_submission = Submission(
                student_id=new_student.id,
                submitted_at=datetime.utcnow(),
                status='pending',
                is_locked=False
            )
            db.session.add(new_submission)
            db.session.commit()

            return jsonify({
                'message': 'New application created successfully',
                'submission_id': new_submission.id
            }), 201

        else:
            # ── First time OR student has no locked submission yet ──
            # Check if student has any pending submission (not yet locked)
            pending_submission = Submission.query.filter_by(
                student_id=student.id,
                is_locked=False
            ).first()

            # Build details from incoming data
            details = student.details or {}
            if isinstance(details, str):
                try:
                    details = json.loads(details)
                except Exception:
                    details = {}

            consent_data = build_consent_data(data)
            main_data_keys = set(data.keys()) - set(consent_data.keys())

            for key in main_data_keys:
                details[key] = data[key]

            details['consentForm'] = consent_data

            # Update student name if changed
            student_name = (
                consent_data.get('studentName') or
                details.get('personalDetails', {}).get('fullName') or
                student.name
            )
            if student_name and student_name != student.name:
                student.name = student_name

            student.details = details
            db.session.add(student)

            if pending_submission:
                # Update existing pending submission
                pending_submission.submitted_at = datetime.utcnow()
                pending_submission.status = 'pending'
                pending_submission.is_locked = True  # Lock it now on submit
                db.session.add(pending_submission)
            else:
                # Create first submission and lock it
                new_submission = Submission(
                    student_id=student.id,
                    submitted_at=datetime.utcnow(),
                    status='pending',
                    is_locked=True  # Lock immediately on first submit
                )
                db.session.add(new_submission)

            db.session.commit()

            return jsonify({
                'message': 'Application submitted successfully'
            }), 201

    except Exception as e:
        db.session.rollback()
        print("Submission error:", str(e))
        return jsonify({'error': 'Internal server error'}), 500


# ── Helper to extract consent data ──
def build_consent_data(data):
    return {
        'studentName': data.get('studentName'),
        'studentDate': data.get('studentDate'),
        'studentSignature': data.get('studentSignature'),
        'guardianName': data.get('guardianName'),
        'guardianDate': data.get('guardianDate'),
        'guardianSignature': data.get('guardianSignature'),
        'guarantorName': data.get('guarantorName'),
        'guarantorDate': data.get('guarantorDate'),
        'guarantorSignature': data.get('guarantorSignature'),
        'submittedAt': datetime.utcnow().isoformat()
    }