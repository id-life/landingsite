'use client';

import React, { useEffect, useRef, useState } from 'react';

const Demo3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const mouse = useRef({ x: 0, y: 0, radius: 160 });
  const particleArray = useRef<Particle[]>([]);
  const animationId = useRef<number | null>(null);
  const imageObj = useRef<HTMLImageElement>();
  const fadeState = useRef<'in' | 'out' | 'inactive'>('inactive');
  const fadeAlpha = useRef(1);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSources = useRef([
    '/imgs/engagement/talk-01.webp',
    '/imgs/engagement/talk-02.webp',
    '/imgs/engagement/talk-03.webp',
    '/imgs/engagement/talk-04.webp',
  ]);

  const switchImage = () => {
    fadeState.current = 'out';
  };

  // 修改代码, 把淡入淡出的同时, 添加粒子扩散和收缩

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
      if (!canvas || !imageObj.current) return;
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
    if (!ctx || !canvas || !imageObj.current) return;
    particleArray.current = [];

    ctx.drawImage(imageObj.current, 0, 0);
    const imgData = ctx.getImageData(0, 0, imageObj.current.naturalWidth, imageObj.current.naturalHeight);
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

    // 处理淡入淡出效果
    if (fadeState.current === 'out') {
      fadeAlpha.current = Math.max(fadeAlpha.current - 0.12, 0);
      if (fadeAlpha.current <= 0) {
        setCurrentImageIndex((prev) => (prev + 1) % imageSources.current.length);
        fadeState.current = 'inactive';
      }
    } else if (fadeState.current === 'in') {
      fadeAlpha.current = Math.min(fadeAlpha.current + 0.12, 1);
      if (fadeAlpha.current >= 1) {
        fadeState.current = 'inactive';
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = fadeAlpha.current;

    particleArray.current.forEach((p) => p.update());

    ctx.globalAlpha = 1;
    animationId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Canvas 初始化
    const canvas = canvasRef.current;
    if (!canvas) return;
    imageObj.current = new Image();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext('2d', { alpha: true, willReadFrequently: true });

    const intervalId = setInterval(switchImage, 5000);

    // 图片加载
    imageObj.current.crossOrigin = 'Anonymous';
    imageObj.current.src = imageSources.current[currentImageIndex];

    imageObj.current.onload = () => {
      if (animationId.current !== null) {
        cancelAnimationFrame(animationId.current);
      }
      initParticles();
      fadeState.current = 'in'; // 新图片加载完成后开始淡入
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
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationId.current !== null) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [currentImageIndex]);

  return <canvas ref={canvasRef} className="absolute left-0 top-0" />;
};

export default React.memo(Demo3);
