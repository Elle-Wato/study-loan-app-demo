from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import db, Document, Student
from utils.s3 import upload_to_s3

uploads_bp = Blueprint('uploads', __name__)

@uploads_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    user_id = get_jwt_identity()['id']
    student = Student.query.filter_by(user_id=user_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    file = request.files['file']
    filename = secure_filename(file.filename)
    url = upload_to_s3(file, filename)
    doc = Document(student_id=student.id, file_url=url)
    db.session.add(doc)
    db.session.commit()
    return jsonify({'url': url})