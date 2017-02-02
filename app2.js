/**
 * Created by Miguel on 31/01/17.
 */


var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require ('mongoose');
var app = express();
var Schema = mongoose.Schema;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Conexión
mongoose.connect('mongodb://localhost:27017/Yo');

// Evento abrir base de datos.
mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
});

// Primero creamos el Schema (Prototipo o molde de los modelos).
// siquiendo la sintaxis nombrecampo: {type: tipo de datos, default: valor por defecto}
var Account = new Schema({
    username: { type: String, required: true },
    date_created: { type: Date, default: Date.now },
    visits: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    age: { type: Number, required: true, min: 18, max: 50}
});

// Luego creamos el modelo "padre" o sea, la clase.
var AccountModel = mongoose.model('Account', Account);

// Ya podemos crear nuevos objetos, para luego guardarlos en la bd como documentos.
// Si no asignamos valores a los campos, tomarán el valor por defecto.

var newUser = new AccountModel(
    { username: 'Vejete', age: 19});
console.log(newUser.username);
console.log(newUser.date_created);
console.log(newUser.visits);
console.log(newUser.active);

// Lo guardamos con el método save que tienen todos los documentos creados a partir de un modelo.
// Obsérvese que se crea automáticamente una coleccion cuyo nombre es el plural del Schema. En este
// caso se crea una colección llamada Accounts.


// Metodo para validar los documentos ANTES de grabarlos. Si no se supera la validación salta un error y no se graba.
// EL métdo validate viene de serie con Mongoose.
newUser.validate(function(error){
    if (error){
        console.log("No se ha superado la validación por el siguiente motivo: " + error);
    }
});

newUser.save();

// Con el modelo podemos ejecutar todos los métodos y operaciones de MongoDB y nos devolverá los resultados.
AccountModel.find({username: 'Antonio'}, function(err,accounts){

    console.log("Encontrados " + accounts.length + " registros.\n");

    for (var n=0; n < accounts.length;n++) {
        console.log("Registro " + (n+1));
        console.log("---------------------------------");
        console.log("Username: " + accounts[n].username);
        console.log("Date Created: " + accounts[n].date_created);
        console.log("Visits: " + accounts[n].visits);
        console.log("Active?: " + accounts[n].active);
        console.log("Age: " + accounts[n].age);
        console.log("\n");
    }
});

// Cerramos la conexión a la base de datos. Es una buena costumbre.
mongoose.connection.close();

http.createServer(app).listen(3000, function(){
    console.log('Servidor Express operativo en puerto 3000');
});