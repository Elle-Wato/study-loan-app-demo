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
    import json
    details = student.details or {}
    if isinstance(details, str):
        try:
            details = json.loads(details)
        except:
            details = {}

    # other detail extraction...

    program = details.get("program", "N/A")

    return {
        # existing fields ...
        'program': program,
        # other fields ...
    }

def serialize_student(student, submission=None):
    """Flatten student + user + submission + documents for frontend"""
    details = student.details or {}

    # Ensure details is a dict (could be JSON stored as string)
    if isinstance(details, str):
        try:
            details = json.loads(details)
        except Exception:
            details = {}

    personal = details.get('personalDetails', {})
    parent = details.get('parentGuardian', {})
    employment = details.get('employmentDetails', {})
    financial = details.get('financialDetails', {})
    loan = details.get('loanDetails', {})
    referees = details.get('referees', {})
    budget = details.get('budgetDetails', {})
    guarantors = details.get('guarantors', [])
    consent = details.get('consentForm', {})

    return {
        'id': student.id,
        'name': student.name or personal.get('fullName') or consent.get('studentName') or 'N/A',
        'email': personal.get('emailAddress') or (student.user.email if student.user else 'N/A'),

        # Academic info
        'course': personal.get('course') or 'N/A',
        'institution': personal.get('institution') or 'N/A',

        # Parent / guardian info
        'parent_name': parent.get('parentName') or 'N/A',
        'parent_phone': parent.get('telephone') or 'N/A',

        # Employment info
        'employment_name': employment.get('name') or 'N/A',
        'employer_name': employment.get('employerName') or 'N/A',
        'employment_position': employment.get('employmentPosition') or 'N/A',

        # Financial info
        'financial_bankName': financial.get('bankName') or 'N/A',
        'financial_accountNumber': financial.get('accountNumber') or 'N/A',
        'financial_hasLoans': financial.get('hasLoans') or 'N/A',
        'financial_loanAmount': financial.get('loanAmount') or 'N/A',
        'financial_outstandingBalance': financial.get('outstandingBalance') or 'N/A',
        'financial_monthlyRepayment': financial.get('monthlyRepayment') or 'N/A',

        # Loan Details
        'loan_universityName': loan.get('universityName') or 'N/A',
        'loan_studyProgram': loan.get('studyProgram') or 'N/A',
        'loan_levelOfStudy': loan.get('levelOfStudy') or 'N/A',
        'loan_amountApplied': loan.get('amountApplied') or 'N/A',
        'loan_repaymentPeriod': loan.get('repaymentPeriod') or 'N/A',
        'loan_security': loan.get('loanSecurity') or 'N/A',

        # Referees
        'first_referee': referees.get('firstReferee', {}),
        'second_referee': referees.get('secondReferee', {}),
        'third_referee': referees.get('thirdReferee', {}),

        # Budget Planner
        'budget_netSalary': budget.get('netSalary') or 'N/A',
        'budget_businessIncome': budget.get('businessIncome') or 'N/A',
        'budget_otherIncome': budget.get('otherIncome') or 'N/A',
        'budget_householdExpenses': budget.get('householdExpenses') or 'N/A',
        'budget_rentalExpenses': budget.get('rentalExpenses') or 'N/A',
        'budget_transportExpenses': budget.get('transportExpenses') or 'N/A',
        'budget_otherExpenses': budget.get('otherExpenses') or 'N/A',

        # Guarantors (list of dicts)
        'guarantors': guarantors,

        # Consent form signatures and dates
        'consent_studentSignature': consent.get('studentSignature'),
        'consent_guardianSignature': consent.get('guardianSignature'),
        'consent_guarantorSignature': consent.get('guarantorSignature'),
        'consent_studentDate': consent.get('studentDate'),
        'consent_guardianDate': consent.get('guardianDate'),
        'consent_guarantorDate': consent.get('guarantorDate'),

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
            return jsonify({'error': 'Unauthorized'}), 403

        student = Student.query.filter_by(user_id=user.id).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404

        data = request.get_json()

        if student.details is None:
            student.details = {}

        student.details.update(data)
        db.session.commit()

        return jsonify({'message': 'Details updated successfully'})

    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500