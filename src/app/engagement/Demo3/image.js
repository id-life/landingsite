window.addEventListener("load", (event) => {
    const canvas = document.getElementById("canvas1");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
  
    let mouse = {
      x: null,
      y: null,
      radius: 350
    };
  
    window.addEventListener("mousemove", function (event) {
      mouse.x = event.x + canvas.clientLeft / 2;
      mouse.y = event.y + canvas.clientTop / 2;
    });
  
    let _clearCanvasTimeout = null;
  
    function clearCanvas() {
      clearTimeout(_clearCanvasTimeout);
      _clearCanvasTimeout = setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 1000);
      ctx.fillStyle = "rgba(0,0,0,.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  
    function drawImage(png) {
      let particleArray = [];
      ctx.drawImage(png, 0, 0);
      let imageWidth = png.width || png.naturalWidth;
      let imageHeight = png.height || png.naturalHeight;
  
      const imgData = ctx.getImageData(0, 0, imageWidth, imageHeight);
      // Erase the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      class Particle {
        constructor(x, y, color, size) {
          // Position
          const baseX = x + canvas.width / 2 - png.width / 2;
          const baseY = y + canvas.height / 2 - png.height / 2;
          this.x = baseX;
          this.y = baseY;
          this.baseX = baseX;
          this.baseY = baseY;
          this.maxBaseDistance = 150;
          this.outLimits = false;
  
          // Velocity of this particle's movement
          this.velocity = Math.random() * 10 + 10;
  
          // Other
          this.color = color;
          this.size = 1;
        }
        draw() {
          ctx.beginPath();
          // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
  
          // ctx.fillStyle = this.color;
          // ctx.fillRect(this.x, this.y, this.x + this.size, this.y + this.size);
          // if (_test++ < 10) {
          //   // console.log(`fillRect(${this.color}) = `, this.x, this.y, this.size);
          // }
        }
        update() {
          // this.draw();
          // return;
          ctx.fillStyle = this.color;
  
          // check mouse position/particle position - collision detection
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          // distance past which the force is zero
          var maxDistance = mouse.radius;
          var force = (maxDistance - distance) / maxDistance;
  
          // if we go below zero, set it to zero.
          if (force < 0) force = 0;
  
          // Calculates the next position based on the variables above
          let directionX = forceDirectionX * force * this.velocity * 2;
          let directionY = forceDirectionY * force * this.velocity * 2;
  
          if (!this.outLimits) {
            this.outLimits = Math.abs(this.x - this.baseX) > this.maxBaseDistance;
          }
  
          if (!this.outLimits && distance < mouse.radius + this.size) {
            // Going away from the mouse
            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Going to original position
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 10;
            }
            // When the particle comes back to position, it does not holds
            // exactly the position it was before, it's almost there
            // This maxOutLimits was created to let this.outLimits not too strict
            let maxOutLimits = 10;
            this.outLimits =
              this.x - this.baseX + this.y - this.baseY > maxOutLimits;
          }
          this.draw();
        }
      }
      function init() {
        particleArray = [];
  
        for (var y = 0, y2 = imgData.height; y < y2; y++) {
          if (y % 2) continue;
          for (var x = 0, x2 = imgData.width; x < x2; x++) {
            if (x % 2) continue;
            // console.log("particle positions: ", x, y);
            // let color = "rgb(255,0,0)";
            // if (imgData.data[x * y]) {
            //   color = imgData.data[x * y].color;
            // }
  
            // particleArray.push(new Particle(positionX, positionY, color));
            const dataStartIndex = y * 4 * imgData.width + x * 4;
            const _r = imgData.data[dataStartIndex];
            const _g = imgData.data[dataStartIndex + 1];
            const _b = imgData.data[dataStartIndex + 2];
            const _a = imgData.data[dataStartIndex + 3];
            if (_a > 180) {
              let color = "rgb(" + _r + "," + _g + "," + _b + ")";
              // let color = "rgb(255,0,0)";
              particleArray.push(new Particle(x, y, color));
            }
          }
        }
        // console.log("particleArray ", particleArray);
      }
      function animate() {
        requestAnimationFrame(animate);
        clearCanvas();
  
        for (let i = 0; i < particleArray.length; i++) {
          particleArray[i].update();
        }
      }
      init();
      animate();
  
      // RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
      window.addEventListener("resize", function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
      });
    }
  
    // Preload the image
    var png = new Image();
    png.crossOrigin = "Anonymous";
    png.src = '/imgs/engagement/talk-01.webp';
    png.addEventListener(
      "load",
      () => {
        // console.log("Image loaded");
        // Draw the image on canvas
        drawImage(png);
      },
      false
    );
  });
  