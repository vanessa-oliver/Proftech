
CREATE TABLE "assunto" (
    cod_assunto SERIAL PRIMARY KEY,
    nome_assunto VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "usuario" (
    cod_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    "eAdmin" BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "prova" (
    cod_prova SERIAL PRIMARY KEY,
    nome_prova VARCHAR(50) NOT NULL,
    data TIMESTAMP NOT NULL UNIQUE,
    cod_assunto INTEGER NOT NULL REFERENCES "assunto" (cod_assunto) ON DELETE CASCADE,
    cod_usuario INTEGER NOT NULL REFERENCES "usuario" (cod_usuario) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "questao" (
    cod_questao SERIAL PRIMARY KEY,
    enunciado VARCHAR(1000) NOT NULL,
    resposta VARCHAR(250) NOT NULL,
    cod_usuario INTEGER NOT NULL REFERENCES "usuario" (cod_usuario) ON DELETE CASCADE,
    cod_assunto INTEGER NOT NULL REFERENCES "assunto" (cod_assunto) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "questaoprova" (
    cod_prova INTEGER NOT NULL REFERENCES "prova" (cod_prova) ON DELETE CASCADE,
    cod_questao INTEGER NOT NULL REFERENCES "questao" (cod_questao) ON DELETE CASCADE,
    PRIMARY KEY (cod_prova, cod_questao),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "cabecalho" (
    cod_cabecalho SERIAL PRIMARY KEY,
    data TIMESTAMP NOT NULL,
    instituicao VARCHAR(100) NOT NULL,
    cod_prova INTEGER NOT NULL REFERENCES "prova" (cod_prova) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prova_assunto ON "prova" (cod_assunto);
CREATE INDEX idx_prova_usuario ON "prova" (cod_usuario);
CREATE INDEX idx_questao_usuario ON "questao" (cod_usuario);
CREATE INDEX idx_questao_assunto ON "questao" (cod_assunto);
CREATE INDEX idx_cabecalho_prova ON "cabecalho" (cod_prova);
