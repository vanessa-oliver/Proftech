const { Sequelize, DataTypes } = require('sequelize');
const sq = require('../config/database.js');
const Disciplina = require('./Disciplina.js');

const Assunto = sq.sequelize.define('Assunto', {
    cod_assunto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_disc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Disciplina,
            key: 'cod_disc'
        }
    },
    nome_assunto: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
});
model: Disciplina;
module.exports = Assunto;
