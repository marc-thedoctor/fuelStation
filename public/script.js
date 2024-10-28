// script.js

// Captura o formulário e o elemento da lista de clientes
const clienteForm = document.getElementById('clienteForm');
const listaClientes = document.getElementById('listaClientes');

// Função para adicionar um cliente
clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cliente = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        veiculo: {
            placa: document.getElementById('placa').value,
            modelo: document.getElementById('modelo').value
        },
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const response = await fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');
            clienteForm.reset();
            listarClientes();  // Atualiza a lista de clientes
        } else {
            alert('Erro ao cadastrar cliente');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Função para listar clientes
async function listarClientes() {
    try {
        const response = await fetch('/clientes');
        const clientes = await response.json();

        listaClientes.innerHTML = '';
        clientes.forEach(cliente => {
            const li = document.createElement('li');
            li.textContent = `${cliente.nome} - Veículo: ${cliente.veiculo.placa} (${cliente.veiculo.modelo}) - Tel: ${cliente.telefone}`;
            listaClientes.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }
}

// Chama a função para listar clientes ao carregar a página
listarClientes();
