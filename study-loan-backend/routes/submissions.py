from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Submission, Student
from utils.email import send_email

submissions_bp = Blueprint('submissions', __name__)

@submissions_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_application():
    user_id = get_jwt_identity()['id']
    student = Student.query.filter_by(user_id=user_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    data = request.get_json()
    student.details = data.get('details', {})
    submission = Submission(student_id=student.id)
    db.session.add(submission)
    db.session.commit()
    send_email('applications@elimishatrust.or.ke', 'New Loan Application', f'Student {student.name} submitted. Details: {student.details}')
    return jsonify({'message': 'Submitted'})