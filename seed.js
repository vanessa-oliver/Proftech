const { sequelize } = require('./config/database');
const Assunto = require('./models/Assunto');
const Usuario = require('./models/Usuario');
const Questao = require('./models/Questao');
const Prova = require('./models/Prova');
const QuestaoProva = require('./models/QuestãoProva');
const bcrypt = require('bcryptjs');

// Carregar associações
require('./models/associations');

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...\n');

        console.log('✅ Conectado ao banco de dados');

        // ========== 1. CRIAR ASSUNTOS ==========
        console.log('\n📚 Criando assuntos...');
        const assuntos = await Assunto.bulkCreate([
              { nome_assunto: 'Álgebra' },
              { nome_assunto: 'Geometria' },
              { nome_assunto: 'Trigonometria' },
              { nome_assunto: 'Cálculo' },
              { nome_assunto: 'História' },
              { nome_assunto: 'Geografia' },
              { nome_assunto: 'Português' },
              { nome_assunto: 'Física' }
        ]);
        console.log(`✅ ${assuntos.length} assuntos criados`);

        // ========== 2. CRIAR USUÁRIOS ==========
        console.log('\n👥 Criando usuários...');
        
        // Criptografar senhas
        const senha1 = await bcrypt.hash('senha123', 10);
        const senha2 = await bcrypt.hash('senha456', 10);
        const senha3 = await bcrypt.hash('senha789', 10);

        const usuarios = await Usuario.bulkCreate([
            {
                nome: 'João Silva',
                email: 'joao@email.com',
                password: senha1,
                eAdmin: true
            },
            {
                nome: 'Maria Santos',
                email: 'maria@email.com',
                password: senha2,
                eAdmin: false
            },
            {
                nome: 'Pedro Oliveira',
                email: 'pedro@email.com',
                password: senha3,
                eAdmin: false
            }
        ]);
        console.log(`✅ ${usuarios.length} usuários criados`);

        // ========== 3. CRIAR QUESTÕES ==========
        console.log('\n❓ Criando questões...');
        
        const questoes = await Questao.bulkCreate([
            {
                enunciado: 'Qual é a fórmula de Bhaskara?',
                resposta: 'x = (-b ± √(b² - 4ac)) / 2a',
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[0].cod_assunto
            },
            {
                enunciado: 'O que é uma equação do segundo grau?',
                resposta: 'Uma equação polinomial de grau 2, da forma ax² + bx + c = 0',
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[0].cod_assunto
            },
            {
                enunciado: 'Resolva a equação: x² - 5x + 6 = 0',
                resposta: 'x = 2 ou x = 3',
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[0].cod_assunto
            },
            {
                enunciado: 'Qual é o perímetro de um quadrado com lado 5cm?',
                resposta: '20 cm (4 × 5)',
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[1].cod_assunto
            },
            {
                enunciado: 'Qual é a área de um círculo com raio 3cm?',
                resposta: '9π cm² ou aproximadamente 28,27 cm²',
                cod_usuario: usuarios[1].cod_usuario,
                cod_assunto: assuntos[1].cod_assunto
            },
            {
                enunciado: 'Quanto é sen(30°)?',
                resposta: '0,5 ou 1/2',
                cod_usuario: usuarios[1].cod_usuario,
                cod_assunto: assuntos[2].cod_assunto
            },
            {
                enunciado: 'Quanto é cos(60°)?',
                resposta: '0,5 ou 1/2',
                cod_usuario: usuarios[1].cod_usuario,
                cod_assunto: assuntos[2].cod_assunto
            },
            {
                enunciado: 'Quanto é tg(45°)?',
                resposta: '1',
                cod_usuario: usuarios[1].cod_usuario,
                cod_assunto: assuntos[2].cod_assunto
            },
            {
                enunciado: 'Em qual ano o Brasil foi descoberto?',
                resposta: '1500',
                cod_usuario: usuarios[2].cod_usuario,
                cod_assunto: assuntos[4].cod_assunto
            },
            {
                enunciado: 'Qual é a capital do Brasil?',
                resposta: 'Brasília',
                cod_usuario: usuarios[2].cod_usuario,
                cod_assunto: assuntos[5].cod_assunto
            },
            {
                enunciado: 'Qual é o maior rio do Brasil?',
                resposta: 'Rio Amazonas',
                cod_usuario: usuarios[2].cod_usuario,
                cod_assunto: assuntos[5].cod_assunto
            },
            {
                enunciado: 'O que é uma dissertação?',
                resposta: 'Um texto que apresenta e discute um tema, com argumentação lógica',
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[6].cod_assunto
            }
        ]);
        console.log(`✅ ${questoes.length} questões criadas`);

        // ========== 4. CRIAR PROVAS ==========
        console.log('\n📋 Criando provas...');
        
        const provas = await Prova.bulkCreate([
            {
                nome_prova: 'Avaliação Bimestral - Álgebra',
                data: new Date('2025-12-20'),
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[0].cod_assunto
            },
            {
                nome_prova: 'Prova de Trigonometria',
                data: new Date('2025-12-22'),
                cod_usuario: usuarios[1].cod_usuario,
                cod_assunto: assuntos[2].cod_assunto
            },
            {
                nome_prova: 'Teste de Geometria',
                data: new Date('2025-12-25'),
                cod_usuario: usuarios[0].cod_usuario,
                cod_assunto: assuntos[1].cod_assunto
            },
            {
                nome_prova: 'Avaliação de História',
                data: new Date('2025-12-27'),
                cod_usuario: usuarios[2].cod_usuario,
                cod_assunto: assuntos[4].cod_assunto
            },
            {
                nome_prova: 'Prova de Geografia',
                data: new Date('2026-01-05'),
                cod_usuario: usuarios[2].cod_usuario,
                cod_assunto: assuntos[5].cod_assunto
            }
        ]);
        console.log(`✅ ${provas.length} provas criadas`);

        // ========== 5. ASSOCIAR QUESTÕES ÀS PROVAS ==========
        console.log('\n🔗 Associando questões às provas...');
        
        // Prova 1 (Álgebra)
        await QuestaoProva.bulkCreate([
            { cod_prova: provas[0].cod_prova, cod_questao: questoes[0].cod_questao },
            { cod_prova: provas[0].cod_prova, cod_questao: questoes[1].cod_questao },
            { cod_prova: provas[0].cod_prova, cod_questao: questoes[2].cod_questao }
        ], { ignoreDuplicates: true });

        // Prova 2 (Trigonometria)
        await QuestaoProva.bulkCreate([
            { cod_prova: provas[1].cod_prova, cod_questao: questoes[5].cod_questao },
            { cod_prova: provas[1].cod_prova, cod_questao: questoes[6].cod_questao },
            { cod_prova: provas[1].cod_prova, cod_questao: questoes[7].cod_questao }
        ], { ignoreDuplicates: true });

        // Prova 3 (Geometria)
        await QuestaoProva.bulkCreate([
            { cod_prova: provas[2].cod_prova, cod_questao: questoes[3].cod_questao },
            { cod_prova: provas[2].cod_prova, cod_questao: questoes[4].cod_questao }
        ], { ignoreDuplicates: true });

        // Prova 4 (História)
        await QuestaoProva.bulkCreate([
            { cod_prova: provas[3].cod_prova, cod_questao: questoes[8].cod_questao }
        ], { ignoreDuplicates: true });

        // Prova 5 (Geografia)
        await QuestaoProva.bulkCreate([
            { cod_prova: provas[4].cod_prova, cod_questao: questoes[9].cod_questao },
            { cod_prova: provas[4].cod_prova, cod_questao: questoes[10].cod_questao }
        ], { ignoreDuplicates: true });

        console.log('✅ Questões associadas às provas com sucesso');

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('🎉 SEED CONCLUÍDO COM SUCESSO!');
        console.log('═══════════════════════════════════════════════════════\n');
        
        console.log('📊 DADOS CRIADOS:');
        console.log(`  • ${assuntos.length} Assuntos`);
        console.log(`  • ${usuarios.length} Usuários`);
        console.log(`  • ${questoes.length} Questões`);
        console.log(`  • ${provas.length} Provas`);
        
        console.log('\n👥 USUÁRIOS (para teste):');
        usuarios.forEach(user => {
            console.log(`  • Email: ${user.email} | Senha: senha123 | Admin: ${user.eAdmin}`);
        });

        console.log('\n🔑 Credenciais de Teste:');
        console.log('  Email: joao@email.com');
        console.log('  Senha: senha123');
        console.log('  Tipo: Admin');
        
        console.log('\n═══════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        process.exit(1);
    }
}

// Executar seed
seedDatabase();
