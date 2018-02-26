import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://harmonizome:emozinomrah@database/harmonizome'
# SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

MAIL_SERVER='smtp.gmail.com'
MAIL_PORT=465
MAIL_USE_SSL=True
MAIL_USERNAME = 'harmonizome@gmail.com'
MAIL_PASSWORD = 'emozinomrah'

BCRYPT_LOG_ROUNDS = 12