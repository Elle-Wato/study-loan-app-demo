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
from flask_mail import Mail
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Add your cPanel SMTP Settings
app.config['MAIL_SERVER'] = 'mail.elimishatrust.or.ke'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'applications@elimishatrust.or.ke'
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD') # Pulls it from the hidden file
app.config['MAIL_DEFAULT_SENDER'] = ('Elimisha Trust', 'applications@elimishatrust.or.ke')

# Initialize Mail
mail = Mail(app)

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