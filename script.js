const visor = document.getElementById("visor");
const lminDisplay = document.getElementById("lmin-display");
const lmaxDisplay = document.getElementById("lmax-display");
let calculadoraLigada = false;
let modoAtual = "";

window.onload = desligarCalculadora();

// Função para ligar a calculadora
function ligarCalculadora() {
  calculadoraLigada = true;
  visor.textContent = "Calculadora ligada. Escolha uma operacao.";

  // Desbloquear inputs
  document.getElementById("input1").disabled = false;
  document.getElementById("input2").disabled = false;
  document.getElementById("input3").disabled = false;
  document.getElementById("input4").disabled = false;

  console.log("Calculadora ligada!");
}

// Função para desligar a calculadora
function desligarCalculadora() {
  calculadoraLigada = false;
  visor.textContent = "Calculadora desligada.";
  lminDisplay.textContent = "";
  lmaxDisplay.textContent = "";
  document.getElementById("input1").value = "";
  document.getElementById("input2").value = "95"; // Valor padrão
  document.getElementById("input3").value = "";
  document.getElementById("input4").value = "";

  // Bloquear inputs
  document.getElementById("input1").disabled = true;
  document.getElementById("input2").disabled = true;
  document.getElementById("input3").disabled = true;
  document.getElementById("input4").disabled = true;

  console.log("Calculadora desligada!");
}

// Função para zerar os cálculos
function zerarCalculadora() {
  if (!calculadoraLigada) {
    alert("Você não é o Evanivaldo para calcular tudo na cabeça!");
    return 0;
  }

  document.getElementById("input1").value = "";
  document.getElementById("input2").value = "95"; // Valor padrão
  document.getElementById("input3").value = "";
  document.getElementById("input4").value = "";
  visor.textContent = "Calculos zerados.";
  lminDisplay.textContent = "";
  lmaxDisplay.textContent = "";
  console.log("Cálculos zerados!");
}

// Função para definir o modo de operação
function setModo(modo) {
  if (!calculadoraLigada) {
    alert("Você não é o Evanivaldo para calcular tudo na cabeça!");
    return 1;
  }

  modoAtual = modo;
  visor.textContent = ""; // Limpa o visor ao selecionar um modo

  // Definir o valor do primeiro input como 0 ou nulo para os modos EP, TN(EM) e TN(EP)
  if (modo === "ep" || modo === "tnem" || modo === "tnep") {
    document.getElementById("input1").value = "";
    document.getElementById("input1").disabled = true;
  } else {
    document.getElementById("input1").disabled = false;
  }

  // Lógica dos cálculos
  switch (modoAtual) {
    case "em":
      document.getElementById("input1").value = "";
      document.getElementById("input3").value = "";
      document.getElementById("input4").value = "";
      document.getElementsByClassName('hotspot-input')[0].placeholder = 'Media';
      document.getElementsByClassName('hotspot-input')[2].placeholder = 'DevPad';
      document.getElementsByClassName('hotspot-input')[3].placeholder = 'n';
      break;
    case "ep":
      document.getElementById("input1").value = "";
      document.getElementById("input3").value = "";
      document.getElementById("input4").value = "";
      document.getElementsByClassName('hotspot-input')[0].placeholder = '---';
      document.getElementsByClassName('hotspot-input')[2].placeholder = 'Sucesso';
      document.getElementsByClassName('hotspot-input')[3].placeholder = 'n';
      break;
    case "tnem":
      document.getElementById("input1").value = "";
      document.getElementById("input3").value = "";
      document.getElementById("input4").value = "";
      document.getElementsByClassName('hotspot-input')[0].placeholder = '---';
      document.getElementsByClassName('hotspot-input')[2].placeholder = 'DevPad';
      document.getElementsByClassName('hotspot-input')[3].placeholder = 'Em';
      break;
    case "tnep":
      document.getElementById("input1").value = "";
      document.getElementById("input3").value = "";
      document.getElementById("input4").value = "";
      document.getElementsByClassName('hotspot-input')[0].placeholder = '---';
      document.getElementsByClassName('hotspot-input')[2].placeholder = 'Sucesso';
      document.getElementsByClassName('hotspot-input')[3].placeholder = 'Ep';
      break;
    default:
      visor.textContent = "Erro";
      return 0;
  }

  console.log(`Modo ${modo.toUpperCase()} selecionado.`);
}

// Função para realizar o cálculo
function calcular() {
  if (!calculadoraLigada) {
    alert("Você não é o Evanivaldo para calcular tudo na cabeça!");
    return;
  }

  if (!modoAtual) {
    visor.textContent = "Escolha um modo antes de calcular.";
    console.log("Nenhum modo selecionado.");
    return 0;
  }

  // Pegar valores dos inputs
  const val1 = parseFloat(document.getElementById("input1").value) || 0;
  const val2 = parseFloat(document.getElementById("input2").value);
  const val3 = parseFloat(document.getElementById("input3").value);
  const val4 = parseFloat(document.getElementById("input4").value);

  // Verificar se os valores são números válidos
  if (isNaN(val2) || isNaN(val3) || isNaN(val4)) {
    visor.textContent = "Valores inválidos. Insira números válidos.";
    console.log("Valores inválidos.");
    return;
  }

  let intervalo;
  let resultado;

  // Lógica dos cálculos
  switch (modoAtual) {
    case "em":
      resultado = calcularErroMedioEM(val1, val2, val3, val4);
      intervalo = calcularIntervaloDeConfiancaEM(val1, val2, val3, val4);
      visor.textContent = `Erro Medio: ${resultado.toFixed(6).slice(0, 4)}`;
      break;
    case "ep":
      resultado = calcularErroMedioEP(val2, val3, val4);
      intervalo = calcularIntervaloDeConfiancaEP(val2, val3, val4);
      visor.textContent = `Erro Proporcao: ${resultado.toFixed(6).slice(0, 4)}`;
      break;
    case "tnem":
      resultado = calcularTamanhoAmostraEM(val2, val3, val4);
      visor.textContent = `Tamanho da Amostra: ${resultado.toFixed(2)} --> ${Math.ceil(resultado)}`;
      break;
    case "tnep":
      resultado = calcularTamanhoAmostraEP(val2, val3, val4);
      visor.textContent = `Tamanho da Amostra: ${resultado.toFixed(2)} --> ${Math.ceil(resultado)}`;
      break;
    default:
      visor.textContent = "Erro";
      return 0;
  }

  if (intervalo) {
    let icLmin = intervalo.lmin;
    let icLmax = intervalo.lmax;
    lminDisplay.textContent = icLmin.toFixed(2);
    lmaxDisplay.textContent = icLmax.toFixed(2);
    console.log(`Modo: ${modoAtual}, Intervalo de Confiança: [${icLmin.toFixed(2)}; ${icLmax.toFixed(2)}]`);
  }
}

// Funções para os novos botões
function apaixonar() {
  // Adicionar o fundo escuro
  const darkBackground = document.createElement("div");
  darkBackground.id = "dark-background";
  darkBackground.className = "dark-background";
  document.body.appendChild(darkBackground);

  // Adicionar a imagem do Evanivaldo
  const evanivaldoVideo = document.createElement("video");
  evanivaldoVideo.id = "evanivaldo-img";
  evanivaldoVideo.src = "Evanivaldo.mp4"; // Substitua pelo caminho correto da imagem do Evanivaldo
  evanivaldoVideo.alt = "Evanivaldo";
  evanivaldoVideo.autoplay = true;
  evanivaldoVideo.loop = true;
  evanivaldoVideo.style.display = "block";
  evanivaldoVideo.style.marginTop = "20px";

  document.body.appendChild(evanivaldoVideo);

  // Adicionar botão de fechar específico
  const closeButtonEvanivaldo = document.createElement("span");
  closeButtonEvanivaldo.className = "close-button-evanivaldo";
  closeButtonEvanivaldo.textContent = "×";
  closeButtonEvanivaldo.onclick = function () {
    document.body.removeChild(evanivaldoVideo);
    document.body.removeChild(closeButtonEvanivaldo);
    document.body.removeChild(darkBackground);
  };

  document.body.appendChild(closeButtonEvanivaldo);

  // Adicionar efeitos de corações próximos
  const heartContainer = document.createElement("div");
  heartContainer.className = "heart-container";
  document.body.appendChild(heartContainer);

  for (let i = 0; i < 5; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heartContainer.appendChild(heart);
  }

  // Garantir que a imagem seja carregada antes de escurecer o fundo
  evanivaldoVideo.onload = function () {
    document.getElementById("dark-background").style.display = "block";
  };
}

function assustar() {
  // Adicionar o fundo escuro
  const darkBackground = document.createElement("div");
  darkBackground.id = "dark-background";
  darkBackground.className = "dark-background";
  document.body.appendChild(darkBackground);

  // Adicionar a imagem do Rogério Leão
  const rogerioVideo = document.createElement("video");
  rogerioVideo.id = "rogerio-img";
  rogerioVideo.src = "Rogerão.mp4"; // Substitua pelo caminho correto da imagem do Rogério Leão
  rogerioVideo.alt = "Rogério Leão";
  rogerioVideo.autoplay = true;
  rogerioVideo.loop = true;
  rogerioVideo.style.display = "block";
  rogerioVideo.style.marginTop = "20px";

  document.body.appendChild(rogerioVideo);

  // Adicionar botão de fechar específico
  const closeButtonRogerio = document.createElement("span");
  closeButtonRogerio.className = "close-button-rogerio";
  closeButtonRogerio.textContent = "×";
  closeButtonRogerio.onclick = function () {
    document.body.removeChild(rogerioVideo);
    document.body.removeChild(closeButtonRogerio);
    document.body.removeChild(darkBackground);
  };

  document.body.appendChild(closeButtonRogerio);

  // Garantir que a imagem seja carregada antes de escurecer o fundo
  rogerioVideo.onload = function () {
    document.getElementById("dark-background").style.display = "block";
  };
}

function equipe() {
  // Adicionar o fundo escuro
  const darkBackground = document.createElement("div");
  darkBackground.id = "dark-background";
  darkBackground.className = "dark-background";
  document.body.appendChild(darkBackground);

  // Adicionar a imagem da equipe
  const equipeImage = document.createElement("img");
  equipeImage.id = "equipe-img";
  equipeImage.src = "trupe.jpeg"; // Substitua pelo caminho correto da imagem da equipe
  equipeImage.alt = "Equipe";
  equipeImage.style.display = "block";
  equipeImage.style.marginTop = "20px";

  document.body.appendChild(equipeImage);

  const message1 = document.createElement("p");
  message1.textContent = "Você está preparado para conhecer...";
  message1.style.fontSize = "24px";
  message1.style.marginTop = "20px";

  const message2 = document.createElement("p");
  message2.textContent = "Glaucon e seus amigos!";
  message2.style.fontSize = "24px";

  document.body.appendChild(message1);
  document.body.appendChild(message2);

  // Adicionar botão de fechar específico
  const closeButtonEquipe = document.createElement("span");
  closeButtonEquipe.className = "close-button-equipe";
  closeButtonEquipe.textContent = "×";
  closeButtonEquipe.onclick = function () {
    document.body.removeChild(equipeImage);
    document.body.removeChild(closeButtonEquipe);
    document.body.removeChild(message1);
    document.body.removeChild(message2);
    document.body.removeChild(darkBackground);
  };

  document.body.appendChild(closeButtonEquipe);

  // Garantir que a imagem seja carregada antes de escurecer o fundo
  equipeImage.onload = function () {
    document.getElementById("dark-background").style.display = "block";
  };
}

// Função para calcular o intervalo de confiança para a média (EM)
function calcularIntervaloDeConfiancaEM(media, grauConfianca, desvioPadrao, tamanhoAmostra) {
  const z = obterValorCritico(grauConfianca);
  let margemDeErro = z * (desvioPadrao / Math.sqrt(tamanhoAmostra));
  const lmin = media - margemDeErro;
  const lmax = media + margemDeErro;
  return { lmin, lmax };
}

// Função para calcular o intervalo de confiança para a proporção (EP)
function calcularIntervaloDeConfiancaEP(grauConfianca, sucessos, tamanhoAmostra) {
  const z = obterValorCritico(grauConfianca);
  const p = sucessos / tamanhoAmostra;
  let margemDeErro = z * Math.sqrt((p * (1 - p)) / tamanhoAmostra);
  margemDeErro = Number(margemDeErro.toFixed(6).slice(0, 4));
  const lmin = p - margemDeErro;
  const lmax = p + margemDeErro;
  console.log(margemDeErro, lmin, lmax);
  return { lmin, lmax };
}

// Função para calcular o erro médio para a média (EM)
function calcularErroMedioEM(media, grauConfianca, desvioPadrao, tamanhoAmostra) {
  const z = obterValorCritico(grauConfianca);
  return z * (desvioPadrao / Math.sqrt(tamanhoAmostra));
}

// Função para calcular o erro médio para a proporção (EP)
function calcularErroMedioEP(grauConfianca, sucessos, tamanhoAmostra) {
  const z = obterValorCritico(grauConfianca);
  const p = sucessos / tamanhoAmostra;
  return z * Math.sqrt((p * (1 - p)) / tamanhoAmostra);
}

// Função para calcular o tamanho da amostra para a média (TN EM)
function calcularTamanhoAmostraEM(grauConfianca, desvioPadrao, erroMedio) {
  const z = obterValorCritico(grauConfianca);
  return (z * desvioPadrao / erroMedio) ** 2;
}

// Função para calcular o tamanho da amostra para a proporção (TN EP)
function calcularTamanhoAmostraEP(grauConfianca, sucessos, erroProporcao) {
  const z = obterValorCritico(grauConfianca);
  const p = sucessos / (sucessos + (1 - sucessos));
  return (z ** 2 * p * (1 - p)) / (erroProporcao ** 2);
}

// Função para obter o valor crítico z com base no grau de confiança
function obterValorCritico(grauConfianca) {
  // Tabela de valores críticos para diferentes graus de confiança
  const tabelaValoresCriticos = {
    90: 1.645,
    95: 1.96,
    99: 2.576
  };
  return tabelaValoresCriticos[grauConfianca] || 1.96; // Valor padrão para 95% de confiança
}

// Função para abrir a ajuda
function abrirAjuda() {
  document.getElementById("help-dialog").style.display = "block";
}

// Função para fechar a ajuda
function fecharAjuda() {
  document.getElementById("help-dialog").style.display = "none";
  // Remover o fundo escuro e as animações
  const darkBackground = document.getElementById("dark-background");
  if (darkBackground) {
    darkBackground.style.display = "none";
  }
  const animationContainer = document.getElementById("animation-container");
  if (animationContainer) {
    animationContainer.style.display = "none";
  }
}