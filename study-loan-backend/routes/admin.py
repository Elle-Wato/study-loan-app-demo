from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from sqlalchemy.orm import aliased
from sqlalchemy import func, and_
from models import db, User, Staff, Student, Submission, Document

admin_bp = Blueprint('admin', __name__)

def admin_or_staff_required():
    # get_jwt_identity() returns email string, so query user to get role
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user or user.role not in ['admin', 'staff']:
        return jsonify({'error': 'Forbidden'}), 403
    return None

@admin_bp.route('/create-staff', methods=['POST'])
@jwt_required()
def create_staff():
    # get_jwt_identity() returns email string
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user or user.role != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    
    data = request.get_json()
    new_user = User(email=data['email'], password_hash=generate_password_hash(data['password']), role='staff')
    db.session.add(new_user)
    db.session.commit()
    staff = Staff(user_id=new_user.id, admin_id=user.id)  # Use user.id for admin_id
    db.session.add(staff)
    db.session.commit()
    return jsonify({'message': 'Staff created'})

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    # get_jwt_identity() returns email string
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user or user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    user_list = [{'id': user.id, 'email': user.email, 'role': user.role, 'created_at': user.created_at} for user in users]
    return jsonify(user_list)

@admin_bp.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    error = admin_or_staff_required()
    if error:
        return error

    # Subquery to get latest submission date per student
    latest_subq = db.session.query(
        Submission.student_id,
        func.max(Submission.submitted_at).label('latest_submitted_at')
    ).group_by(Submission.student_id).subquery('latest_subq')

    # Alias Submission for joining with subquery
    LatestSubmission = aliased(Submission)

    # Join Student with LatestSubmission filtered by subquery max date
    # Join condition: same student_id & submission.submitted_at = max submitted_at 
    students_with_submissions = db.session.query(
        Student,
        LatestSubmission.status,
        LatestSubmission.submitted_at,
    ).outerjoin(
        latest_subq,
        Student.id == latest_subq.c.student_id
    ).outerjoin(
        LatestSubmission,
        and_(
            LatestSubmission.student_id == latest_subq.c.student_id,
            LatestSubmission.submitted_at == latest_subq.c.latest_submitted_at,
        )
    ).all()

    result = []
    for student, status, submitted_at in students_with_submissions:
        documents = [{'id': doc.id, 'file_url': doc.file_url, 'uploaded_at': doc.uploaded_at.isoformat()} for doc in student.documents]

        result.append({
            'id': student.id,
            'name': student.name or 'N/A',
            'details': student.details or {},
            'documents': documents,
            'status': status or 'pending',
            'submitted_at': submitted_at.isoformat() if submitted_at else None,
        })

    return jsonify(result)

@admin_bp.route('/students/update-details', methods=['PATCH'])
@jwt_required()
def update_student_details():
    try:
        user_email = get_jwt_identity()
        print(f"Updating details for: {user_email}")
        
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
        
        data = request.get_json()
        print(f"Received data: {data}")
        
        # Ensure student.details is a dict
        if student.details is None:
            student.details = {}
        student.details = {**student.details, **data}
        print(f"Updated details: {student.details}")
        
        db.session.commit()
        print("Details updated successfully")
        return jsonify({'message': 'Details updated'})
    
    except Exception as e:
        print(f"Error in update_student_details: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_details(student_id):
    error = admin_or_staff_required()
    if error:
        return error

    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    # Fetch latest submission for the student
    latest_submission = Submission.query.filter_by(student_id=student_id).order_by(Submission.submitted_at.desc()).first()

    # Gather documents uploaded by student
    documents = [{'id': doc.id, 'file_url': doc.file_url, 'uploaded_at': doc.uploaded_at.isoformat()} for doc in student.documents]

    response = {
        'id': student.id,
        'name': student.name or 'N/A',
        'details': student.details or {},
        'documents': documents,
        'status': latest_submission.status if latest_submission else 'pending',
        'submitted_at': latest_submission.submitted_at.isoformat() if latest_submission else None
    }

    return jsonify(response)