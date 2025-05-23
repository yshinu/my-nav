"use client";

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const FlowingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    let animationFrameId: number;

    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode
      ? 'rgba(0, 0, 0, 0.1)' // 深色模式背景，更暗一些以突出流星
      : 'rgba(230, 240, 255, 0.1)'; // 浅色模式背景

    const particleBaseHue = isDarkMode ? 200 : 220; // 流星颜色，深色模式偏冷蓝，浅色模式偏亮蓝
    const particleLightness = isDarkMode ? 60 : 75;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles: Particle[] = [];
    const numParticles = 7; // 调整粒子数量为5-10颗
    const minParticleSize = 2; // 流星头部最小大小
    const maxParticleSize = 5; // 流星头部最大大小
    const minParticleSpeed = 0.5; // 流星最小速度
    const maxParticleSpeed = 2; // 流星最大速度
    const minTailLength = 50; // 流星拖尾最小长度
    const maxTailLength = 150; // 流星拖尾最大长度

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      tailLength: number;
      history: { x: number; y: number; alpha: number }[] = [];

      constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.alpha = 0;
        this.color = '';
        this.size = 0;
        this.tailLength = 0;
        this.history = [];
        this.reset();
      }

      reset() {
        if (Math.random() < 0.5) {
          this.x = Math.random() * canvas.width;
          this.y = -this.tailLength * Math.random() * 0.5; // 从画布稍偏上方开始
        } else {
          this.x = -this.tailLength * Math.random() * 0.5; // 从画布稍偏左侧开始
          this.y = Math.random() * canvas.height;
        }

        this.size = Math.random() * (maxParticleSize - minParticleSize) + minParticleSize;
        const speed = Math.random() * (maxParticleSpeed - minParticleSpeed) + minParticleSpeed;
        // 流星主要向右下方移动，角度可以稍微随机
        const angle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 6); // 45度左右，加一点随机性
        this.vx = speed * Math.cos(angle);
        this.vy = speed * Math.sin(angle);
        this.alpha = Math.random() * 0.4 + 0.6; // 初始透明度，确保流星可见
        this.tailLength = Math.random() * (maxTailLength - minTailLength) + minTailLength;

        const hue = particleBaseHue + Math.random() * 40 - 20; // 颜色范围调整
        this.color = `hsl(${hue}, 90%, ${particleLightness}%)`;
        this.history = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.003; // 减慢淡出速度，使流星持续更久

        this.history.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.history.length > this.tailLength) {
          this.history.shift();
        }

        if (this.x > canvas.width + this.tailLength || this.y > canvas.height + this.tailLength || this.alpha <= 0) {
          this.reset();
        }
      }

      drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        // 绘制拖尾
        if (this.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (let i = 1; i < this.history.length; i++) {
            const pos = this.history[i];
            const tailAlpha = pos.alpha * (i / this.history.length) * 0.8; // 拖尾透明度调整
            const lineWidth = this.size * (i / this.history.length) * 0.8; // 拖尾宽度调整

            // 创建渐变效果的拖尾
            const prevPos = this.history[i-1];
            const gradient = ctx.createLinearGradient(prevPos.x, prevPos.y, pos.x, pos.y);
            gradient.addColorStop(0, `hsla(${particleBaseHue + 20}, 90%, ${particleLightness}%, ${tailAlpha * 0.5})`);
            gradient.addColorStop(1, `hsla(${particleBaseHue - 20}, 90%, ${particleLightness}%, ${tailAlpha})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(lineWidth, 0.1); // 确保线条宽度不为0
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            // 为了让拖尾更平滑，可以再次beginPath
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
          }
        }

        // 绘制流星头部 (五角星)
        ctx.fillStyle = this.color;
        this.drawStar(this.x, this.y, 5, this.size, this.size / 2);
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        // 背景渐变保持不变，或者可以根据流星效果调整
        background: theme === 'dark'
          ? 'linear-gradient(to bottom right, #0a0a0a, #000000)' // 深色模式更暗的渐变
          : 'linear-gradient(to bottom right, #e6f0ff, #f0f8ff)' // 浅色模式渐变
      }}
    />
  );
};

export default FlowingBackground;