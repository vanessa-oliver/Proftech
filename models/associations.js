const Assunto = require('./Assunto');
const Usuario = require('./Usuario');
const Prova = require('./Prova');
const Questao = require('./Questao');
const QuestaoProva = require('./QuestãoProva');
const cabecalho = require('./cabecalho');

function defineAssociations() {
    Prova.belongsTo(Assunto, {
        foreignKey: 'cod_assunto',
        as: 'assunto'
    });
    Assunto.hasMany(Prova, {
        foreignKey: 'cod_assunto',
        as: 'provas'
    });

    Prova.belongsTo(Usuario, {
        foreignKey: 'cod_usuario',
        as: 'usuario'
    });
    Usuario.hasMany(Prova, {
        foreignKey: 'cod_usuario',
        as: 'provas'
    });

    Questao.belongsTo(Assunto, {
        foreignKey: 'cod_assunto',
        as: 'assunto'
    });
    Assunto.hasMany(Questao, {
        foreignKey: 'cod_assunto',
        as: 'questoes'
    });

    Questao.belongsTo(Usuario, {
        foreignKey: 'cod_usuario',
        as: 'usuario'
    });
    Usuario.hasMany(Questao, {
        foreignKey: 'cod_usuario',
        as: 'questoes'
    });

    QuestaoProva.belongsTo(Prova, {
        foreignKey: 'cod_prova',
        as: 'prova'
    });
    Prova.hasMany(QuestaoProva, {
        foreignKey: 'cod_prova',
        as: 'questoes'
    });

    QuestaoProva.belongsTo(Questao, {
        foreignKey: 'cod_questao',
        as: 'questao'
    });
    Questao.hasMany(QuestaoProva, {
        foreignKey: 'cod_questao',
        as: 'provas'
    });

    Prova.belongsToMany(Questao, {
        through: QuestaoProva,
        foreignKey: 'cod_prova',
        otherKey: 'cod_questao',
        as: 'questoes_prova'
    });
    Questao.belongsToMany(Prova, {
        through: QuestaoProva,
        foreignKey: 'cod_questao',
        otherKey: 'cod_prova',
        as: 'provas_questao'
    });

    cabecalho.belongsTo(Prova, {
        foreignKey: 'cod_prova',
        as: 'prova'
    });
    Prova.hasMany(cabecalho, {
        foreignKey: 'cod_prova',
        as: 'cabecalhos'
    });
}

module.exports = defineAssociations;
