/* Simulador fiel de aplicar_starvation(): 80+ absoluto + ciclo 2:1.
   Roda só na página de prática; não depende de bibliotecas. */
(function () {
  "use strict";

  var root = document.querySelector(".sim");
  if (!root) return;

  var LIM = [2, 1];
  var state = {
    qSuper: [],
    qPadrao: [],
    qConv: [],
    etapa: 0,
    contador: 0,
    next: { 0: 1, 1: 1, 2: 1 },
    log: []
  };

  var elSuper = document.getElementById("sim-super");
  var elPadrao = document.getElementById("sim-padrao");
  var elConv = document.getElementById("sim-conv");
  var cSuper = document.getElementById("sim-c-super");
  var cPadrao = document.getElementById("sim-c-padrao");
  var cConv = document.getElementById("sim-c-conv");
  var status = document.getElementById("sim-status");
  var logEl = document.getElementById("sim-log");

  function labelFor(level) {
    var prefix = level === 0 ? "S" : level === 1 ? "P" : "C";
    var n = state.next[level]++;
    return prefix + n;
  }

  function add(level, silent) {
    var item = { level: level, label: labelFor(level) };
    if (level === 0) state.qSuper.push(item);
    else if (level === 1) state.qPadrao.push(item);
    else state.qConv.push(item);
    if (!silent) render("Adicionado " + item.label + " na fila " + (level === 0 ? "80+" : level === 1 ? "padrão" : "convencional") + ".");
  }

  function reset() {
    state.qSuper = [];
    state.qPadrao = [];
    state.qConv = [];
    state.etapa = 0;
    state.contador = 0;
    state.next = { 0: 1, 1: 1, 2: 1 };
    state.log = [];
    add(0, true); add(0, true);
    add(1, true); add(1, true); add(1, true);
    add(2, true); add(2, true);
    render("Cenário inicial: 2 super, 3 padrão e 2 convencionais. Chame e observe o ciclo.");
  }

  function listHtml(items) {
    return items.map(function (it) {
      return "<li>" + it.label + "</li>";
    }).join("");
  }

  function phaseName() {
    return state.etapa === 0 ? "padrão" : "convencional";
  }

  function render(message) {
    elSuper.innerHTML = listHtml(state.qSuper);
    elPadrao.innerHTML = listHtml(state.qPadrao);
    elConv.innerHTML = listHtml(state.qConv);
    cSuper.textContent = state.qSuper.length;
    cPadrao.textContent = state.qPadrao.length;
    cConv.textContent = state.qConv.length;

    var extra = state.qSuper.length ? " · há 80+ na fila: a próxima chamada é super" : "";
    status.innerHTML = "Etapa: <strong>" + state.etapa + " (" + phaseName() + ")</strong> · contador: <strong>" +
      state.contador + "/" + LIM[state.etapa] + "</strong>" + extra +
      (message ? "<br><span>" + message + "</span>" : "");
  }

  function callNext() {
    if (!state.qSuper.length && !state.qPadrao.length && !state.qConv.length) {
      state.etapa = 0;
      state.contador = 0;
      render("Filas vazias: etapa e contador zerados, como no retorno None, None, 0, 0.");
      return;
    }

    if (state.qSuper.length) {
      var s = state.qSuper.shift();
      state.log.push(s.label);
      render("Chamado " + s.label + " (80+). O ciclo NÃO foi reiniciado: etapa " + state.etapa + ", contador " + state.contador + ".");
      paintLog();
      return;
    }

    var filas = [state.qPadrao, state.qConv];
    for (var tentativa = 0; tentativa < 2; tentativa++) {
      var fila = filas[state.etapa];
      var limite = LIM[state.etapa];
      if (state.contador >= limite || !fila.length) {
        state.etapa = (state.etapa + 1) % 2;
        state.contador = 0;
        continue;
      }

      var c = fila.shift();
      state.contador += 1;
      var msg = "Chamado " + c.label + " (" + (c.level === 1 ? "padrão" : "convencional") + "). ";
      if (state.contador >= limite || !fila.length) {
        state.etapa = (state.etapa + 1) % 2;
        state.contador = 0;
        msg += "Cota atingida ou fila esvaziou: avançou a etapa.";
      } else {
        msg += "Ainda há cota nesta etapa.";
      }
      state.log.push(c.label);
      render(msg);
      paintLog();
      return;
    }

    render("Nenhuma fila elegível nesta tentativa (estado inesperado).");
  }

  function paintLog() {
    if (!state.log.length) {
      logEl.textContent = "— log de chamadas —";
      return;
    }
    logEl.textContent = state.log.slice(-12).join("  →  ");
  }

  root.querySelectorAll("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      add(parseInt(btn.getAttribute("data-add"), 10), false);
    });
  });

  var callBtn = document.getElementById("sim-call");
  if (callBtn) callBtn.addEventListener("click", callNext);

  var resetBtn = document.getElementById("sim-reset");
  if (resetBtn) resetBtn.addEventListener("click", reset);

  reset();
})();
