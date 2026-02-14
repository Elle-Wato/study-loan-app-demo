from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='student')  # student, staff, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student = db.relationship('Student', backref='user', uselist=False)
    staff = db.relationship('Staff', backref='user', uselist=False, foreign_keys='Staff.user_id')
    admin_staff = db.relationship('Staff', backref='admin', uselist=False, foreign_keys='Staff.admin_id')
    
    def __repr__(self):
        return f'<User {self.email}>'

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True, index=True)  # One user per student
    name = db.Column(db.String(100))
    details = db.Column(db.JSON)  # Form data as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    documents = db.relationship('Document', backref='student', cascade='all, delete-orphan')
    submissions = db.relationship('Submission', backref='student', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Student {self.name}>'

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False, index=True)
    file_url = db.Column(db.Text, nullable=False)  # Use Text for longer URLs
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Document {self.file_url}>'

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False, index=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(20), default='pending', index=True)  # pending, approved, rejected
    
    # Add a check constraint for valid statuses (PostgreSQL-specific)
    __table_args__ = (
        db.CheckConstraint(status.in_(['pending', 'approved', 'rejected']), name='valid_status'),
    )
    
    def __repr__(self):
        return f'<Submission {self.status} for Student {self.student_id}>'

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True, index=True)  # One user per staff
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True, index=True)  # Optional link to admin user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Staff User {self.user_id} under Admin {self.admin_id}>'