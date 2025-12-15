document.addEventListener('DOMContentLoaded', () => {
    const btnAddAssunto = document.getElementById('btnAddAssunto');
    const btnAddUsuario = document.getElementById('btnAddUsuario');
    const inlineModalEl = document.getElementById('inlineModal');
    
    if (!inlineModalEl) return;
    
    const inlineModal = new bootstrap.Modal(inlineModalEl);
    const inlineFields = document.getElementById('inlineFields');
    const inlineForm = document.getElementById('inlineForm');
    let currentType = null; // 'assunto' ou 'usuario'

    if (btnAddAssunto) {
        btnAddAssunto.addEventListener('click', (e) => {
            e.preventDefault();
            currentType = 'assunto';
            document.getElementById('inlineModalLabel').innerText = 'Adicionar Assunto';
            inlineFields.innerHTML = `
                <div class="mb-3"> 
                    <label class="form-label">Nome do Assunto</label>
                    <input type="text" name="nome_assunto" class="form-control" required />
                </div>`;
            inlineModal.show();
        });
    }

    if (btnAddUsuario) {
        btnAddUsuario.addEventListener('click', (e) => {
            e.preventDefault();
            currentType = 'usuario';
            document.getElementById('inlineModalLabel').innerText = 'Adicionar Professor (Usuário)';
            inlineFields.innerHTML = `
                <div class="mb-3"> 
                    <label class="form-label">Nome</label>
                    <input type="text" name="nome" class="form-control" required />
                </div>
                <div class="mb-3"> 
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" required />
                </div>
                <div class="mb-3"> 
                    <label class="form-label">Senha</label>
                    <input type="password" name="password" class="form-control" required />
                </div>`;
            inlineModal.show();
        });
    }

    if (inlineForm) {
        inlineForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(inlineForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                if (currentType === 'assunto') {
                    const res = await fetch('/subject/api/assuntos', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(payload) 
                    });
                    
                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.error || 'Erro ao criar assunto');
                    }
                    
                    const novo = await res.json();
                    const sel = document.getElementById('cod_assunto');
                    const opt = document.createElement('option');
                    opt.value = novo.cod_assunto;
                    opt.text = novo.nome_assunto;
                    sel.appendChild(opt);
                    sel.value = novo.cod_assunto;
                    
                    inlineModal.hide();
                    inlineForm.reset();
                    alert('Assunto criado com sucesso!');
                    
                } else if (currentType === 'usuario') {
                    const res = await fetch('/user/api/usuarios', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(payload) 
                    });
                    
                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.error || 'Erro ao criar professor');
                    }
                    
                    const novo = await res.json();
                    const sel = document.getElementById('cod_usuario');
                    const opt = document.createElement('option');
                    opt.value = novo.cod_usuario;
                    opt.text = novo.nome + ' (id: ' + novo.cod_usuario + ')';
                    sel.appendChild(opt);
                    sel.value = novo.cod_usuario;
                    
                    inlineModal.hide();
                    inlineForm.reset();
                    alert('Professor criado com sucesso!');
                }
            } catch (err) {
                console.error('Erro:', err);
                alert('Erro: ' + err.message);
            }
        });
    }
});
