FROM ubuntu:17.10
MAINTAINER Moshe Silverstein <moshe.silverstein@mssm.com>

RUN set -x \
    && apt-get update \
    && apt-get install -y \
        libmysqlclient-dev \
        python3 \
        python3-dev \
        python3-pip \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install --no-cache-dir --upgrade \
        pip \
    && pip3 install --no-cache-dir \
        flask \
        flask-sqlalchemy \
        flask-bcrypt \
        flask-mail \
        flask-login \
        flask-wtf \
        Flask-MySQL \
        mysql-connector-python-rf

VOLUME [ "/harmonizome" ]
WORKDIR /harmonizome

ENTRYPOINT python3 /harmonizome/run.py
