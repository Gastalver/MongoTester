/**
 * Created by Miguel on 30/01/17.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connection URL
var url = 'mongodb://localhost:27017/Yo';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Conectado correctamente al servidor MongoDB");

    // Insertamos documento
    var coleccion = db.collection('misHobbies');
    coleccion.insertOne({'nombreAficion':'Aeromodelismo'}, function(err,resultado){
        assert.equal(err, null);
        assert.equal(1, resultado.result.n);
        assert.equal(1, resultado.ops.length);
        console.log("resultado.result.n: " + resultado.result.n + "\n");

    });

    coleccion.findOne({},function(error, documento) {
            console.log(documento._id + " - " + documento.nombreAficion);
        }
    );


    db.close();
});


// Funcion para insertar documentos en la coleccion documentos.
var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}






http.createServer(app).listen(3000, function(){
    console.log('Servidor Express operativo en puerto 3000');
});