from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User, Staff, Student, Submission

admin_bp = Blueprint('admin', __name__)

def admin_or_staff_required():
    identity = get_jwt_identity()
    if identity['role'] not in ['admin', 'staff']:
        return jsonify({'error': 'Forbidden'}), 403
    return None

@admin_bp.route('/create-staff', methods=['POST'])
@jwt_required()
def create_staff():
    if get_jwt_identity()['role'] != 'admin':
        return jsonify({'error': 'Forbidden'}), 403
    data = request.get_json()
    user = User(email=data['email'], password_hash=generate_password_hash(data['password']), role='staff')
    db.session.add(user)
    db.session.commit()
    staff = Staff(user_id=user.id, admin_id=get_jwt_identity()['id'])
    db.session.add(staff)
    db.session.commit()
    return jsonify({'message': 'Staff created'})

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    user_list = [{'id': user.id, 'email': user.email, 'role': user.role, 'created_at': user.created_at} for user in users]
    return jsonify(user_list)

@admin_bp.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    error = admin_or_staff_required()
    if error: return error
    students = db.session.query(Student, Submission).join(Submission).all()
    data = [{'id': s.Student.id, 'name': s.Student.name, 'details': s.Student.details, 'status': s.Submission.status} for s in students]
    return jsonify(data)