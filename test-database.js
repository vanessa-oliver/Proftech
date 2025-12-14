const sq = require('./config/database.js');
const Assunto = require('./models/Assunto.js');
const Usuario = require('./models/Usuario.js');
const Prova = require('./models/Prova.js');
const Questao = require('./models/Questao.js');
const QuestaoProva = require('./models/QuestãoProva.js');
const cabecalho = require('./models/cabecalho.js');
const defineAssociations = require('./models/associations.js');

// Definir associações
defineAssociations();

async function testDatabase() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...\n');
        
        // Teste 1: Autenticação
        await sq.sequelize.authenticate();
        console.log('✅ Conexão bem-sucedida com o banco de dados!');
        
        // Teste 2: Sincronizar models
        console.log('\n🔄 Sincronizando models com o banco...');
        await sq.sequelize.sync({ alter: true });
        console.log('✅ Models sincronizados com sucesso!');
        
        // Teste 3: Criar um assunto
        console.log('\n📝 Criando assunto de teste...');
        const assunto = await Assunto.create({
            nome_assunto: 'Matemática'
        });
        console.log('✅ Assunto criado:', assunto.toJSON());
        
        // Teste 4: Criar um usuário
        console.log('\n👤 Criando usuário de teste...');
        const usuario = await Usuario.create({
            nome: 'João Silva',
            email: `joao${Date.now()}@test.com`,
            password: 'senha123',
            eAdmin: false
        });
        console.log('✅ Usuário criado:', usuario.toJSON());
        
        // Teste 5: Criar uma prova
        console.log('\n📋 Criando prova de teste...');
        const prova = await Prova.create({
            nome_prova: 'Prova P1',
            data: new Date(),
            cod_assunto: assunto.cod_assunto,
            cod_usuario: usuario.cod_usuario
        });
        console.log('✅ Prova criada:', prova.toJSON());
        
        // Teste 6: Criar questões
        console.log('\n❓ Criando questões de teste...');
        const questao1 = await Questao.create({
            enunciado: 'Qual é 2 + 2?',
            resposta: '4',
            cod_usuario: usuario.cod_usuario,
            cod_assunto: assunto.cod_assunto
        });
        console.log('✅ Questão 1 criada:', questao1.toJSON());
        
        const questao2 = await Questao.create({
            enunciado: 'Qual é 3 + 3?',
            resposta: '6',
            cod_usuario: usuario.cod_usuario,
            cod_assunto: assunto.cod_assunto
        });
        console.log('✅ Questão 2 criada:', questao2.toJSON());
        
        // Teste 7: Associar questões à prova
        console.log('\n🔗 Associando questões à prova...');
        await QuestaoProva.create({
            cod_prova: prova.cod_prova,
            cod_questao: questao1.cod_questao
        });
        await QuestaoProva.create({
            cod_prova: prova.cod_prova,
            cod_questao: questao2.cod_questao
        });
        console.log('✅ Questões associadas à prova!');
        
        // Teste 8: Criar cabeçalho
        console.log('\n📄 Criando cabeçalho de teste...');
        const header = await cabecalho.create({
            data: new Date(),
            instituicao: 'Universidade Teste',
            cod_prova: prova.cod_prova
        });
        console.log('✅ Cabeçalho criado:', header.toJSON());
        
        // Teste 9: Buscar dados com relacionamentos
        console.log('\n🔍 Buscando dados com relacionamentos...');
        const provaComDetalhes = await Prova.findByPk(prova.cod_prova, {
            include: [
                { model: Assunto, as: 'assunto' },
                { model: Usuario, as: 'usuario' }
            ]
        });
        console.log('✅ Prova com relacionamentos:', JSON.stringify(provaComDetalhes, null, 2));
        
        // Teste 10: Listar todas as questões de uma prova
        console.log('\n📚 Listando questões da prova...');
        const questoesDaProva = await QuestaoProva.findAll({
            where: { cod_prova: prova.cod_prova },
            include: [{ model: Questao, as: 'questao' }]
        });
        console.log('✅ Questões encontradas:', questoesDaProva.length);
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ TODOS OS TESTES PASSARAM COM SUCESSO!');
        console.log('='.repeat(50));
        
        await sq.sequelize.close();
        
    } catch (error) {
        console.error('\n❌ ERRO DURANTE OS TESTES:');
        console.error(error.message);
        console.error(error);
        process.exit(1);
    }
}

testDatabase();
