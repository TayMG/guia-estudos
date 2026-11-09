/* ============================================================
   Base de Estudos — A3 · Tema 1
   Interações: tema, menu mobile, busca, progresso, copiar código.
   Sem dependências. Funciona abrindo o index.html direto (file://).
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- tema claro/escuro ---------- */
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* file:// sem storage */ } }

  /* escuro é o padrão; a escolha do usuário fica salva */
  var theme = safeGet("a3-theme") || "dark";
  root.setAttribute("data-theme", theme);

  function themeLabel(t) { return t === "dark" ? "☀ Tema claro" : "☾ Tema escuro"; }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.textContent = themeLabel(theme);
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      safeSet("a3-theme", next);
      btn.textContent = themeLabel(next);
    });
  });

  /* ---------- menu mobile ---------- */
  var sidebar = document.querySelector(".sidebar");
  var menuBtn = document.querySelector("[data-menu]");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function () { sidebar.classList.toggle("open"); });
    document.addEventListener("click", function (e) {
      if (window.innerWidth > 1000) return;
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) sidebar.classList.remove("open");
    });
  }

  /* ---------- item ativo do menu ---------- */
  var page = (location.pathname.split("/").pop() || "index.html");
  if (!page || page === "") page = "index.html";
  document.querySelectorAll(".nav a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  /* ---------- busca ---------- */
  var input = document.querySelector(".search-input");
  var results = document.querySelector(".search-results");
  var INDEX = window.SEARCH_INDEX || [];

  function norm(s) {
    return (s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function renderResults(q) {
    if (!results) return;
    var nq = norm(q).trim();
    if (nq.length < 2) { results.classList.remove("open"); results.innerHTML = ""; return; }
    var hits = INDEX.filter(function (it) {
      return norm(it.t).indexOf(nq) > -1 || norm(it.k).indexOf(nq) > -1;
    }).slice(0, 12);

    if (!hits.length) {
      results.innerHTML = '<div class="search-empty">Nada encontrado para “' + q + '”.</div>';
      results.classList.add("open");
      return;
    }
    results.innerHTML = hits.map(function (it) {
      return '<a href="' + it.u + '">' + it.t + "<small>" + (it.p || "") + "</small></a>";
    }).join("");
    results.classList.add("open");
  }

  if (input) {
    input.addEventListener("input", function () { renderResults(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; results.classList.remove("open"); }
      if (e.key === "Enter") {
        var first = results.querySelector("a");
        if (first) location.href = first.getAttribute("href");
      }
    });
    document.addEventListener("click", function (e) {
      if (!results.contains(e.target) && e.target !== input) results.classList.remove("open");
    });
    // atalho "/" para focar a busca
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus(); input.select();
      }
    });
  }

  /* ---------- copiar código ---------- */
  document.querySelectorAll("pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copiar";
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code") || pre;
      var text = code.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = "copiado ✓";
          setTimeout(function () { btn.textContent = "copiar"; }, 1400);
        });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); btn.textContent = "copiado ✓"; } catch (e) {}
        document.body.removeChild(ta);
        setTimeout(function () { btn.textContent = "copiar"; }, 1400);
      }
    });
    pre.appendChild(btn);
  });

  /* ---------- checklist persistente ---------- */
  var checks = document.querySelectorAll('input[data-study]');
  checks.forEach(function (cb) {
    var key = "a3-study-" + cb.getAttribute("data-study");
    if (safeGet(key) === "1") cb.checked = true;
    cb.addEventListener("change", function () {
      safeSet(key, cb.checked ? "1" : "0");
      updateProgress();
    });
  });

  function updateProgress() {
    var fill = document.querySelector(".progress-fill");
    var label = document.querySelector("[data-progress-label]");
    if (!fill) return;
    var all = document.querySelectorAll("input[data-study]");
    var done = document.querySelectorAll("input[data-study]:checked");
    var pct = all.length ? Math.round((done.length / all.length) * 100) : 0;
    fill.style.width = pct + "%";
    if (label) label.textContent = done.length + " de " + all.length + " (" + pct + "%)";
  }
  updateProgress();
})();
