from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Student
from utils.email import send_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email, password, role = data['email'], data['password'], data.get('role', 'student')
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email exists'}), 400
    user = User(email=email, password_hash=generate_password_hash(password), role=role)
    db.session.add(user)
    db.session.commit()
    if role == 'student':
        student = Student(user_id=user.id)
        db.session.add(student)
        db.session.commit()
   # send_email(email, 'Welcome!', 'Registration successful.')
    return jsonify({'message': 'User registered'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({'token': token})
    return jsonify({'error': 'Invalid credentials'}), 401