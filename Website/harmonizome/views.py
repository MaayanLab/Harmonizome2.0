from flask import render_template, request, redirect, send_from_directory, flash, session, url_for
import os
import time
from harmonizome import app, db, models, mail
import datetime
from flask_mail import Message
from .emails import send_email
from itsdangerous import URLSafeTimedSerializer
from .forms import RegistrationForm, UsernamePasswordForm, EmailForm, PasswordForm, ResourceForm, DatasetForm, FileForm
from flask_login import login_user, logout_user, login_required, current_user
from collections import Counter

app.secret_key = 'fbhwgcovmy'

ts = URLSafeTimedSerializer(app.config["SECRET_KEY"])

@app.route('/')
@app.route('/harmonizome/', methods=['GET'])
def index():
    return render_template('home.html',
                            title='Harmonizome')

@app.route('/harmonizome/datasets/')
def resources():
    resource_count = models.Resources.query.count()
    dataset_count = models.DataSet.query.count()
    resources = models.Resources.query.order_by(models.Resources.name).all()
    datasets = models.DataSet.query.with_entities(models.DataSet.name, models.DataSet.resource, models.DataSet.description).distinct()
    return render_template('resources.html', title="Resources", resource_count=resource_count, dataset_count=dataset_count, resources=resources, datasets=datasets)

@app.route('/harmonizome/datasetpage/<variable>')
def datasetpage(variable):
    dataset = models.DataSet.query.filter_by(name=variable).first()
    files = models.Files.query.filter_by(dataset=variable).all()
    citations = models.Citations.query.filter_by(resource=variable).all()
    attributes = models.Associations.query.filter_by(dataset=variable).with_entities(models.Associations.attribute).distinct().limit(3).all()
    associations = []
    for thing in attributes:
        for attribute in thing:
            upassociations = models.Associations.query.filter_by(dataset=variable, attribute=attribute).order_by(models.Associations.weight.desc()).limit(50).all()
            downassociations = models.Associations.query.filter_by(dataset=variable, attribute=attribute).order_by(models.Associations.weight).limit(50).all()
            associations += upassociations
            associations += downassociations[::-1]


    for file in files:
        if 'Matrix Normalized' in file.name:
            PM = file
        elif 'Matrix Unprocessed' in file.name:
            UPM = file
        elif 'Matrix Standardized' in file.name:
            SM = file
        # elif 'Matrix Tertiary' in file.name or 'Matrix Binary' in file.name:
        #     TM = file
        elif 'Up Gene' in file.name:
            UG = file
        elif 'Down Gene' in file.name:
            DG = file
        elif 'Up Attribute' in file.name:
            UA = file
        elif 'Down Attribute' in file.name:
            DA = file
        elif 'Gene Similarity' in file.name:
            GS = file
        elif 'Attribute Similarity' in file.name:
            AS = file
        elif 'Gene List' in file.name or 'Matrix Binary' in file.name:
            GL = file
        elif 'Attribute List' in file.name:
            AL = file
        elif 'Edge' in file.name:
            E = file
    if dataset != None:
        return render_template('datasetpage.html',
                                title=dataset.name,
                                dataset=dataset,
                                PM=PM,
                                UPM=UPM,
                                SM=SM,
                                # TM=TM,
                                UG=UG,
                                DG=DG,
                                UA=UA,
                                DA=DA,
                                GS=GS,
                                AS=AS,
                                GL=GL,
                                AL=AL,
                                E=E,
                                citations=citations,
                                associations=associations,
                                attributes=attributes)
    else:
        return render_template('datasetpage.html', title='Not Found', dataset=dataset)


@app.route('/harmonizome/genepage/<variable>')
def genapage(variable):
    association_count = models.Associations.query.filter_by(gene=variable).count()
    dataset_count = models.Associations.query.filter_by(gene=variable).with_entities(models.Associations.dataset).distinct().count()
    gene = models.Gene.query.filter_by(symbol=variable).first()
    associations = models.Associations.query.filter_by(gene=variable).order_by(models.Associations.weight.desc()).all()
    datasets= models.Associations.query.filter_by(gene=variable).with_entities(models.Associations.dataset).distinct()
    if gene != None:
        return render_template('genepage.html',
                                title=gene.symbol,
                                gene=gene,
                                association_count=association_count,
                                dataset_count=dataset_count,
                                associations=associations,
                                datasets=datasets)
    else:
        return render_template('genenotfound.html', title='Gene Not Found', gene=variable)

@app.route('/harmonizome/datavisulization')
def datavisulization():
    return render_template('datavisulization.html',
                                title='Data Visulization')


@app.route('/harmonizome/discover')
def discover():
    genes = models.Gene.query.with_entities(models.Gene.symbol).limit(10).all()
    return render_template('discover.html',
                                title='Discover',
                                genes=genes)
