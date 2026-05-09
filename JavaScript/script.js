document.addEventListener("DOMContentLoaded", () => {
    criarControlesCabecalho();
    configurarTema();
    configurarMenuResponsivo();
    configurarFormularioContato();
});

// Cria os botões de menu e tema em todas as páginas sem repetir HTML.
function criarControlesCabecalho() {
    const cabecalho = document.querySelector(".cabecalho");
    const navegacao = document.querySelector(".navegacao");

    if (!cabecalho || !navegacao || document.querySelector(".controles-cabecalho")) {
        return;
    }

    navegacao.id = navegacao.id || "navegacao-principal";

    const controles = document.createElement("div");
    controles.className = "controles-cabecalho";

    const botaoMenu = document.createElement("button");
    botaoMenu.className = "botao-menu";
    botaoMenu.type = "button";
    botaoMenu.textContent = "Menu";
    botaoMenu.setAttribute("aria-controls", navegacao.id);
    botaoMenu.setAttribute("aria-expanded", "true");

    const botaoTema = document.createElement("button");
    botaoTema.className = "botao-tema";
    botaoTema.type = "button";
    botaoTema.textContent = "Tema escuro";
    botaoTema.setAttribute("aria-label", "Alternar tema claro e escuro");

    controles.append(botaoMenu, botaoTema);
    cabecalho.insertBefore(controles, navegacao);
}

// Alterna entre tema claro e escuro e salva a escolha do usuário.
function configurarTema() {
    const botaoTema = document.querySelector(".botao-tema");
    const temaSalvo = localStorage.getItem("tema-portfolio");

    if (temaSalvo === "escuro") {
        document.body.classList.add("tema-escuro");
    }

    atualizarTextoTema(botaoTema);

    if (!botaoTema) {
        return;
    }

    botaoTema.addEventListener("click", () => {
        document.body.classList.toggle("tema-escuro");

        const temaAtual = document.body.classList.contains("tema-escuro") ? "escuro" : "claro";
        localStorage.setItem("tema-portfolio", temaAtual);
        atualizarTextoTema(botaoTema);
    });
}

function atualizarTextoTema(botaoTema) {
    if (!botaoTema) {
        return;
    }

    const temaEscuroAtivo = document.body.classList.contains("tema-escuro");
    botaoTema.textContent = temaEscuroAtivo ? "Tema claro" : "Tema escuro";
}

// Fecha ou exibe o menu em telas pequenas.
function configurarMenuResponsivo() {
    const navegacao = document.querySelector(".navegacao");
    const botaoMenu = document.querySelector(".botao-menu");

    if (!navegacao || !botaoMenu) {
        return;
    }

    const consultaMobile = window.matchMedia("(max-width: 600px)");

    function atualizarMenu() {
        if (consultaMobile.matches) {
            navegacao.classList.add("menu-fechado");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.textContent = "Menu";
            return;
        }

        navegacao.classList.remove("menu-fechado");
        botaoMenu.setAttribute("aria-expanded", "true");
        botaoMenu.textContent = "Menu";
    }

    botaoMenu.addEventListener("click", () => {
        const menuFechado = navegacao.classList.toggle("menu-fechado");
        botaoMenu.setAttribute("aria-expanded", String(!menuFechado));
        botaoMenu.textContent = menuFechado ? "Menu" : "Fechar";
    });

    navegacao.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (consultaMobile.matches) {
                navegacao.classList.add("menu-fechado");
                botaoMenu.setAttribute("aria-expanded", "false");
                botaoMenu.textContent = "Menu";
            }
        });
    });

    atualizarMenu();
    if (consultaMobile.addEventListener) {
        consultaMobile.addEventListener("change", atualizarMenu);
    } else {
        consultaMobile.addListener(atualizarMenu);
    }
}

// Valida o formulário de contato e simula o envio da mensagem.
function configurarFormularioContato() {
    const formulario = document.getElementById("formulario-contato");
    const retorno = document.getElementById("retorno-formulario");

    if (!formulario || !retorno) {
        return;
    }

    formulario.setAttribute("novalidate", "");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nome = formulario.nome.value.trim();
        const email = formulario.email.value.trim();
        const mensagem = formulario.mensagem.value.trim();

        if (!nome || !email || !mensagem) {
            mostrarRetornoFormulario(retorno, "Preencha todos os campos antes de enviar.", "erro");
            focarPrimeiroCampoVazio(formulario);
            return;
        }

        if (!emailValido(email)) {
            mostrarRetornoFormulario(retorno, "Digite um e-mail válido, como usuario@dominio.com.", "erro");
            formulario.email.focus();
            return;
        }

        formulario.reset();
        mostrarRetornoFormulario(retorno, "Mensagem enviada com sucesso!", "sucesso");
    });
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function focarPrimeiroCampoVazio(formulario) {
    const campoVazio = Array.from(formulario.elements).find((campo) => {
        const camposValidaveis = ["INPUT", "TEXTAREA"].includes(campo.tagName);
        return camposValidaveis && !campo.value.trim();
    });

    if (campoVazio) {
        campoVazio.focus();
    }
}

function mostrarRetornoFormulario(elemento, mensagem, tipo) {
    elemento.textContent = mensagem;
    elemento.classList.remove("sucesso", "erro");
    elemento.classList.add(tipo);
}
