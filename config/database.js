const Sequelize = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});
sequelize.authenticate() 
    .then(() => { 
        console.log('Banco de dados conectado com sucesso'); 
    }) 
    .catch(err => { 
        console.error('Erro ao conectar ao banco de dados:', err); 
    });
module.exports = {
    sequelize: sequelize,
    Sequelize: Sequelize
};
