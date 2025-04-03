// 请用 react threejs fiber 重写这段代码, 实现同样的功能

'use client';

import React, { useEffect, useRef } from 'react';

const Demo3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouse = useRef({ x: 0, y: 0, radius: 160 });
  const particleArray = useRef<Particle[]>([]);
  const animationId = useRef<number | null>(null);
  const imageObj = useRef(new Image());

  class Particle {
    baseX: number = 0;
    baseY: number = 0;
    x: number = 0;
    y: number = 0;
    color: string = '';
    size: number = 0;
    velocity: number = 0;
    maxBaseDistance: number = 0;
    outLimits: boolean = false;

    constructor(x: number, y: number, color: string) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      this.baseX = x + canvas.width / 2 - imageObj.current.width / 2;
      this.baseY = y + canvas.height / 2 - imageObj.current.height / 2;
      this.x = this.baseX;
      this.y = this.baseY;
      this.color = color;
      this.size = 1;
      this.velocity = Math.random() * 15 + 15;
      this.maxBaseDistance = 120;
      this.outLimits = false;
    }

    draw() {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      const dx = mouse.current.x - this.x;
      const dy = mouse.current.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = mouse.current.radius;
      let force = (maxDistance - distance) / maxDistance;

      if (force < 0) force = 0;

      const forceDirX = dx / distance;
      const forceDirY = dy / distance;
      const dirX = forceDirX * force * this.velocity * 2;
      const dirY = forceDirY * force * this.velocity * 2;

      if (!this.outLimits) {
        this.outLimits = Math.abs(this.x - this.baseX) > this.maxBaseDistance;
      }

      if (!this.outLimits && distance < maxDistance + this.size) {
        this.x -= dirX;
        this.y -= dirY;
      } else {
        if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
        if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
        this.outLimits = Math.abs(this.x - this.baseX + this.y - this.baseY) > 10;
      }

      this.draw();
    }
  }

  const initParticles = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx || !canvas) return;
    particleArray.current = [];

    ctx.drawImage(imageObj.current, 0, 0);
    const imgData = ctx.getImageData(
      0,
      0,
      imageObj.current.naturalWidth,
      imageObj.current.naturalHeight
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < imgData.height; y += 2) {
      for (let x = 0; x < imgData.width; x += 2) {
        const index = (y * imgData.width + x) * 4;
        const alpha = imgData.data[index + 3];

        if (alpha > 180) {
          const color = `rgb(
            ${imgData.data[index]},
            ${imgData.data[index + 1]},
            ${imgData.data[index + 2]}
          )`;
          particleArray.current.push(new Particle(x, y, color));
        }
      }
    }
  };

  const animate = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // 创建尾迹效果
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particleArray.current.forEach(p => p.update());
    animationId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Canvas 初始化
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext('2d', { alpha: true, willReadFrequently: true });

    // 图片加载
    imageObj.current.crossOrigin = 'Anonymous';
    imageObj.current.src = '/imgs/engagement/talk-01.webp';

    imageObj.current.onload = () => {
      initParticles();
      animate();
    };

    // 鼠标追踪
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    // 窗口调整
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationId.current !== null) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='absolute top-0 left-0'
    />
  );
};

export default React.memo(Demo3);