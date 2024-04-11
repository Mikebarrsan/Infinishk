const { AsyncLocalStorage } = require('async_hooks');
const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Usuario{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDUsuario, mi_password) {
        this.IDUsuario = mi_IDUsuario;
        this.password = mi_password;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        //Dentro del método del modelo que crea el usuario
        //El segundo argumento es el número de veces que se aplica el algoritmo, actualmente 12 se considera un valor seguro
        //El código es asíncrono, por lo que hay que regresar la promesa
        return bcrypt.hash(this.password, 12)
            .then((password_cifrado) => {
                return db.execute(
                    'INSERT INTO Usuario (IDUsuario, Contraseña, usuarioActivo) VALUES (?, ?, 1)',
                    [this.IDUsuario, password_cifrado]
                );
            })
            .catch((error) => {
                console.log(error)
                throw Error('Nombre de usuario duplicado. Ya existe un usuario con ese nombre.')
            });
    }

    static fetchOne(IDUsuario, Contrasena) {
        return db.execute('SELECT * FROM Usuario WHERE IDUsuario = ?',
            [IDUsuario]);
    }
    static getPermisos(IDUsuario) {
        return db.execute(
            `SELECT funcion
            FROM Usuario U, Posee P, Rol R, Contiene C, CasoUso Ca
            WHERE U.IDUsuario = ? AND U.IDUsuario = P.IDUsuario
            AND P.IDRol = R.IDRol AND R.IDRol = C.IDRol 
            AND C.IDCasoUso = Ca.IDCasoUso`,
            [IDUsuario]);
    }

    static getRol(IDUsuario){
        return db.execute(`SELECT Ca.funcion, P.IDRol
        FROM Usuario U
        JOIN Posee P ON U.IDUsuario = P.IDUsuario
        JOIN Rol R ON P.IDRol = R.IDRol
        JOIN Contiene C ON R.IDRol = C.IDRol
        JOIN CasoUso Ca ON C.IDCasoUso = Ca.IDCasoUso
        WHERE U.IDUsuario = ?`,[IDUsuario]);
    }
}