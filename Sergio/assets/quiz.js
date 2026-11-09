/* Motor do quiz: usa window.QUIZ_DATA e os mesmos componentes CSS da base. */
(function () {
  "use strict";
  var data = window.QUIZ_DATA || [];
  var list = document.getElementById("quiz-list");
  var scoreEl = document.getElementById("quiz-score");
  var restartBtn = document.getElementById("quiz-restart");
  var answered = 0;
  var correct = 0;

  if (!list || !scoreEl) return;

  function fmt(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function updateScore() {
    scoreEl.textContent = correct + " de " + answered + " corretas" +
      (answered ? " (" + Math.round(correct / answered * 100) + "%)" : "");
  }

  function build() {
    list.innerHTML = "";
    answered = 0;
    correct = 0;
    updateScore();

    data.forEach(function (item, i) {
      var card = document.createElement("div");
      card.className = "q";

      var num = document.createElement("div");
      num.className = "q-num";
      num.textContent = "QUESTÃO " + String(i + 1).padStart(2, "0");
      card.appendChild(num);

      var text = document.createElement("div");
      text.className = "q-text";
      text.innerHTML = fmt(item.q);
      card.appendChild(text);

      var opts = document.createElement("div");
      opts.className = "opts";
      var fb = document.createElement("div");
      fb.className = "fb";
      var done = false;

      item.opts.forEach(function (label, idx) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        btn.innerHTML = fmt(label);

        btn.addEventListener("click", function () {
          if (done) return;
          done = true;
          answered++;
          var isRight = idx === item.a;
          if (isRight) correct++;

          Array.prototype.forEach.call(opts.children, function (b, j) {
            b.disabled = true;
            if (j === item.a) b.classList.add("correct");
          });
          if (!isRight) btn.classList.add("wrong");

          fb.className = "fb show " + (isRight ? "ok" : "no");
          fb.innerHTML = "";
          var head = document.createElement("strong");
          head.innerHTML = isRight ? "✓ Correto" : "✗ Resposta correta: " + fmt(item.opts[item.a]);
          var body = document.createElement("span");
          body.innerHTML = fmt(item.e);
          fb.appendChild(head);
          fb.appendChild(body);
          updateScore();
        });

        opts.appendChild(btn);
      });

      card.appendChild(opts);
      card.appendChild(fb);
      list.appendChild(card);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      build();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  build();
})();
