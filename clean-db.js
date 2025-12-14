const { sequelize } = require('./config/database');

async function cleanDatabase() {
    try {
        console.log('🗑️ Limpando banco de dados...\n');

        // Desabilitar restrições de chave estrangeira
        await sequelize.query('SET session_replication_role = replica;');

        // Limpar tabelas
        const tables = ['questaoprova', 'prova', 'questao', 'assunto', 'usuario'];
        for (const table of tables) {
            await sequelize.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
            console.log(`✅ Tabela ${table} limpa`);
        }

        // Reabilitar restrições
        await sequelize.query('SET session_replication_role = default;');

        console.log('\n✅ Banco de dados limpo com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao limpar banco:', error);
        process.exit(1);
    }
}

cleanDatabase();
