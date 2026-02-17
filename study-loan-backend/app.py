from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate  # New import
from config import Config
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.submissions import submissions_bp
from routes.uploads import uploads_bp
from routes.staff import staff_bp
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30) 

CORS(app, origins=['http://127.0.0.1:5173', 'http://localhost:3000', app.config.get('FRONTEND_URL', 'http://localhost:3000')])
db.init_app(app)
migrate = Migrate(app, db)  # New line: Initialize Flask-Migrate

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(submissions_bp, url_prefix='/submissions')
app.register_blueprint(uploads_bp, url_prefix='/uploads')
app.register_blueprint(staff_bp, url_prefix='/staff')

if __name__ == '__main__':
    app.run(debug=True)