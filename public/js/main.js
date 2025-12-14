// Funcionalidades JavaScript para ProfTech

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers do Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Fechar offcanvas ao clicar em um link
    const offcanvasLinks = document.querySelectorAll('.offcanvas-body a');
    const offcanvasElement = document.getElementById('offcanvasExample');
    
    if (offcanvasElement) {
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        
        offcanvasLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (this.classList.contains('nav-link')) {
                    offcanvas.hide();
                }
            });
        });
    }

    // Animação de fade in ao carregar
    const elements = document.querySelectorAll('.fade-in, .slide-up');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = el.classList.contains('fade-in') ? 'fadeIn 0.5s ease-in forwards' : 'slideUp 0.5s ease-out forwards';
        }, 100);
    });

    // Adicionar classe active ao link da navegação atual
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.navbar-nav a, .offcanvas-body a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
        }
    });

    // Confirmação antes de deletar
    const deleteButtons = document.querySelectorAll('[data-delete-confirm]');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!confirm('Tem certeza que deseja deletar? Esta ação não pode ser desfeita!')) {
                e.preventDefault();
            }
        });
    });

    // Validação de formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios!');
            }
        });

        // Remover classe de erro ao começar a digitar
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    });

    // Mostrar/Ocultar senha
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });

    // Auto-hide de alertas após 5 segundos
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    console.log('ProfTech - Sistema inicializado com sucesso!');
});

// Função auxiliar para enviar formulários via AJAX
function submitFormAjax(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData
            });

            if (response.ok) {
                if (callback && typeof callback === 'function') {
                    callback(true, response);
                }
            } else {
                if (callback && typeof callback === 'function') {
                    callback(false, response);
                }
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            if (callback && typeof callback === 'function') {
                callback(false, error);
            }
        }
    });
}

// Função para formatar data
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
}

// Função para mostrar notificação
function showNotification(message, type = 'info', duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}
