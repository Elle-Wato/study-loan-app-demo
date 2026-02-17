from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from sqlalchemy.orm import aliased
from sqlalchemy import func, and_

from models import db, User, Staff, Student, Submission, Document
import json

admin_bp = Blueprint('admin', __name__)

# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------

def admin_or_staff_required():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user or user.role not in ['admin', 'staff']:
        return jsonify({'error': 'Forbidden'}), 403
    return None

def serialize_student(student, submission=None):
    """Return student data with raw details for frontend"""
    
    return {
        'id': student.id,
        'name': student.name or 'N/A',
        'email': student.user.email if student.user else 'N/A',
        
        # Send raw details as-is
        'details': student.details or {},
        
        # Submission info
        'status': submission.status if submission else 'pending',
        'submitted_at': submission.submitted_at.isoformat() if submission else None,
        
        # Uploaded documents
        'documents': [
            {
                'id': doc.id,
                'file_url': doc.file_url,
                'uploaded_at': doc.uploaded_at.isoformat()
            } for doc in student.documents
        ]
    }

# -------------------------------------------------------------------
# Create Staff (Admin only)
# -------------------------------------------------------------------

@admin_bp.route('/create-staff', methods=['POST'])
@jwt_required()
def create_staff():
    user_email = get_jwt_identity()
    admin_user = User.query.filter_by(email=user_email).first()

    if not admin_user or admin_user.role != 'admin':
        return jsonify({'error': 'Forbidden'}), 403

    data = request.get_json()

    new_user = User(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role='staff'
    )
    db.session.add(new_user)
    db.session.commit()

    staff = Staff(user_id=new_user.id, admin_id=admin_user.id)
    db.session.add(staff)
    db.session.commit()

    return jsonify({'message': 'Staff created successfully'}), 201

# -------------------------------------------------------------------
# Admin: View all users
# -------------------------------------------------------------------

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user or user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    users = User.query.all()
    return jsonify([
        {
            'id': u.id,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat()
        }
        for u in users
    ])

# -------------------------------------------------------------------
# Staff/Admin: List students (Dashboard Table)
# -------------------------------------------------------------------

@admin_bp.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    error = admin_or_staff_required()
    if error:
        return error

    # Subquery to get latest submission per student
    latest_subq = db.session.query(
        Submission.student_id,
        func.max(Submission.submitted_at).label('latest_submitted_at')
    ).group_by(Submission.student_id).subquery()

    LatestSubmission = aliased(Submission)

    rows = db.session.query(
        Student,
        LatestSubmission
    ).outerjoin(
        latest_subq,
        Student.id == latest_subq.c.student_id
    ).outerjoin(
        LatestSubmission,
        and_(
            LatestSubmission.student_id == latest_subq.c.student_id,
            LatestSubmission.submitted_at == latest_subq.c.latest_submitted_at
        )
    ).all()

    result = []
    for student, submission in rows:
        result.append(serialize_student(student, submission))

    return jsonify(result)

# -------------------------------------------------------------------
# Staff/Admin: Full Loan Application Review
# -------------------------------------------------------------------

@admin_bp.route('/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_details(student_id):
    error = admin_or_staff_required()
    if error:
        return error

    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    latest_submission = Submission.query \
        .filter_by(student_id=student_id) \
        .order_by(Submission.submitted_at.desc()) \
        .first()

    return jsonify(serialize_student(student, latest_submission))

# -------------------------------------------------------------------
# Student: Update their own details
# -------------------------------------------------------------------

@admin_bp.route('/students/update-details', methods=['PATCH'])
@jwt_required()
def update_student_details():
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user or user.role != 'student':
            print("❌ UNAUTHORIZED: User is not a student")
            return jsonify({'error': 'Unauthorized'}), 403

        student = Student.query.filter_by(user_id=user.id).first()
        if not student:
            print("❌ STUDENT NOT FOUND")
            return jsonify({'error': 'Student profile not found'}), 404

        incoming_data = request.get_json()
        
        # 🔥 DEBUG PRINTS
        print("\n" + "=" * 60)
        print("🔵 INCOMING DATA:")
        print(json.dumps(incoming_data, indent=2))
        print("\n🟡 EXISTING DETAILS BEFORE MERGE:")
        print(json.dumps(student.details, indent=2))
        print("=" * 60 + "\n")

        # Always ensure details is a dict
        existing_details = student.details if student.details else {}

        if isinstance(existing_details, str):
            try:
                existing_details = json.loads(existing_details)
            except:
                existing_details = {}

        # 🔥 SIMPLE MERGE - just update the dict
        existing_details.update(incoming_data)

        # 🔥 CRITICAL: Create NEW dict to force SQLAlchemy to detect change
        student.details = dict(existing_details)
        
        # Mark as modified explicitly
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(student, 'details')
        
        # Also update student name if provided
        if 'personalDetails' in incoming_data and 'fullName' in incoming_data['personalDetails']:
            student.name = incoming_data['personalDetails']['fullName']

        # 🔥 FORCE COMMIT
        db.session.commit()

        print("✅ SAVED SUCCESSFULLY")
        print("🟢 DETAILS AFTER MERGE:")
        print(json.dumps(student.details, indent=2))
        print("=" * 60 + "\n")

        return jsonify({'message': 'Details updated successfully'})

    except Exception as e:
        db.session.rollback()
        print("\n❌ ERROR OCCURRED:")
        print(str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500