(function () {
  var canvas = document.getElementById('meshCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var nodes = [];

  var NODE_COUNT = 80;
  var CONNECT_DIST = 180;
  var MOUSE_RADIUS = 250;
  var mouseX = -1000, mouseY = -1000;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.6,
        baseOpacity: Math.random() * 0.3 + 0.08,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function drawMesh(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = canvas.width + 20;
      if (n.x > canvas.width + 20) n.x = -20;
      if (n.y < -20) n.y = canvas.height + 20;
      if (n.y > canvas.height + 20) n.y = -20;
    }

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i];
        var b = nodes[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          var lineOpacity = (1 - dist / CONNECT_DIST) * 0.12;
          var midX = (a.x + b.x) / 2;
          var midY = (a.y + b.y) / 2;
          var mouseDist = Math.sqrt((midX - mouseX) * (midX - mouseX) +
                                    (midY - mouseY) * (midY - mouseY));

          if (mouseDist < MOUSE_RADIUS) {
            var mouseInfluence = 1 - mouseDist / MOUSE_RADIUS;
            lineOpacity += mouseInfluence * 0.15;
          }

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(0, 212, 170, ' + lineOpacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var pulse = Math.sin(time * n.pulseSpeed + n.pulseOffset);
      var opacity = n.baseOpacity + pulse * 0.08;

      var mDist = Math.sqrt((n.x - mouseX) * (n.x - mouseX) +
                            (n.y - mouseY) * (n.y - mouseY));
      var mouseGlow = 0;

      if (mDist < MOUSE_RADIUS) {
        mouseGlow = (1 - mDist / MOUSE_RADIUS);
        opacity += mouseGlow * 0.4;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 170, ' + opacity + ')';
      ctx.fill();

      if (opacity > 0.25 || mouseGlow > 0.3) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, ' + (opacity * 0.08) + ')';
        ctx.fill();
      }
    }
  }

  var animTime = 0;
  function animate() {
    animTime += 16;
    drawMesh(animTime);
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  createNodes();
  animate();

  window.addEventListener('resize', function () {
    resizeCanvas();
    createNodes();
  });
})();
