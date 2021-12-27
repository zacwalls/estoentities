from flask import render_template
from flask_socketio import SocketIO, emit

from app import app


es_chars = {
    "Á": "&Aacute;",
    "á": "&aacute;",
    "É": "&Eacute;",
    "é": "&eacute;",
    "Í": "&Iacute;",
    "í": "&iacute;",
    "Ñ": "&Ntilde;",
    "ñ": "&ntilde;",
    "Ó": "&Oacute;",
    "ó": "&oacute;",
    "Ú": "&Uacute;",
    "ú": "&uacute;",
    "Ü": "&Uuml;",
    "ü": "&uuml;",
    "«": "&laquo;",
    "»": "&raquo;",
    "¿": "&iquest;",
    "¡": "&iexcl;",
    "€": "&euro;",
    "₧": "&#8359;",
}

socketio = SocketIO(app, cors_allowed_origins='*') 

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@socketio.on('update')
def update(data):
    output = ""

    for char in str(data['text']):
        if char in es_chars:
            output += es_chars[char]
        else:
            output += char

    emit('updated', {'output': output})

socketio.run(app, log_output=True)