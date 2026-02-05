from flask import Flask, request, jsonify
import jwt
import os
from models import Usuario  # pyright: ignore[reportMissingImports] # Ajusta según tu estructura

app = Flask(__name__)

@app.route('/api/usuarios/login', methods=['POST'])
async def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Validaciones
        if not email or not password:
            return jsonify({'error': 'Email y password requeridos'}), 400

        usuario = await Usuario.find_one({'email': email})
        if not usuario or not await usuario.comparar_password(password):
            return jsonify({'error': 'Credenciales inválidas'}), 401

        token = jwt.encode(
            {'id': str(usuario._id)}, 
            os.environ.get('JWT_SECRET'), 
            algorithm='HS256'
        )
        
        return jsonify({
            'token': token,
            'usuario': {
                'id': str(usuario._id),
                'nombre': usuario.nombre,
                'email': usuario.email
            }
        }), 200
        
    except Exception as error:
        return jsonify({'error': 'Error en el servidor'}), 500