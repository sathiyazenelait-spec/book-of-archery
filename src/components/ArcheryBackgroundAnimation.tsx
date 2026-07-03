import { useRef, useEffect } from "react";

const ArcheryBackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Archery Arrow structure
    interface Arrow {
      x: number;
      y: number;
      speed: number;
      length: number;
      angle: number;
      opacity: number;
      active: boolean;
    }

    const arrows: Arrow[] = [];

    // Subtle pulsing targets
    interface Target {
      x: number;
      y: number;
      baseRadius: number;
      pulseSpeed: number;
      phase: number;
    }

    const targets: Target[] = [
      { x: width * 0.1, y: height * 0.3, baseRadius: 100, pulseSpeed: 0.002, phase: 0 },
      { x: width * 0.9, y: height * 0.7, baseRadius: 130, pulseSpeed: 0.0015, phase: Math.PI },
    ];

    // Spawn a swift gold arrow
    const spawnArrow = (): Arrow => {
      const startY = Math.random() * height;
      const angle = (Math.random() - 0.5) * 0.12; // slight diagonal angle
      return {
        x: -150,
        y: startY,
        speed: 14 + Math.random() * 10, // high speed
        length: 50 + Math.random() * 20,
        angle,
        opacity: 0.45 + Math.random() * 0.45,
        active: true,
      };
    };

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Archery Targets in background coordinates
      targets.forEach((tgt) => {
        tgt.phase += tgt.pulseSpeed;
        const scale = 1 + Math.sin(tgt.phase) * 0.03;
        const radius = tgt.baseRadius * scale;

        // Archery target colors (Yellow, Red, Blue, Black, White rings)
        const colors = [
          "rgba(202, 138, 4, 0.07)",  // Gold center
          "rgba(202, 138, 4, 0.035)",
          "rgba(220, 38, 38, 0.045)", // Red rings
          "rgba(220, 38, 38, 0.02)",
          "rgba(37, 99, 235, 0.04)",  // Blue rings
          "rgba(37, 99, 235, 0.02)",
          "rgba(0, 0, 0, 0.04)",      // Black rings
          "rgba(255, 255, 255, 0.06)" // White outer ring
        ];

        let currentRad = radius;
        for (let i = 0; i < colors.length; i++) {
          ctx.beginPath();
          ctx.arc(tgt.x, tgt.y, currentRad, 0, Math.PI * 2);
          ctx.strokeStyle = colors[i];
          ctx.lineWidth = 1.8;
          ctx.stroke();
          currentRad -= radius / colors.length;
          if (currentRad <= 0) break;
        }

        // Concentric target crosshair lines
        ctx.beginPath();
        ctx.moveTo(tgt.x - radius - 15, tgt.y);
        ctx.lineTo(tgt.x + radius + 15, tgt.y);
        ctx.moveTo(tgt.x, tgt.y - radius - 15);
        ctx.lineTo(tgt.x, tgt.y + radius + 15);
        ctx.strokeStyle = "rgba(202, 138, 4, 0.02)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 2. Spawn and Draw Arrows
      if (Math.random() < 0.009 && arrows.filter((a) => a.active).length < 3) {
        arrows.push(spawnArrow());
      }

      arrows.forEach((arr) => {
        if (!arr.active) return;

        // Move arrow positions
        arr.x += arr.speed * Math.cos(arr.angle);
        arr.y += arr.speed * Math.sin(arr.angle);

        // Deactivate once off screen
        if (arr.x > width + 150) {
          arr.active = false;
        }

        ctx.save();
        ctx.translate(arr.x, arr.y);
        ctx.rotate(arr.angle);

        // Golden motion blur trail
        const gradient = ctx.createLinearGradient(0, 0, -arr.length * 1.6, 0);
        gradient.addColorStop(0, `rgba(202, 138, 4, ${arr.opacity})`);
        gradient.addColorStop(0.3, `rgba(202, 138, 4, ${arr.opacity * 0.45})`);
        gradient.addColorStop(1, "rgba(202, 138, 4, 0)");
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arr.length * 1.6, 0);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Arrow Shaft
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arr.length, 0);
        ctx.strokeStyle = `rgba(202, 138, 4, ${arr.opacity * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Arrow Head
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-7, -3.5);
        ctx.lineTo(-7, 3.5);
        ctx.closePath();
        ctx.fillStyle = `rgba(202, 138, 4, ${arr.opacity})`;
        ctx.fill();

        // Arrow Fletching (Back feathers)
        ctx.beginPath();
        // Top feather
        ctx.moveTo(-arr.length + 8, 0);
        ctx.lineTo(-arr.length, -4);
        ctx.lineTo(-arr.length - 3, -4);
        ctx.lineTo(-arr.length + 3, 0);
        // Bottom feather
        ctx.moveTo(-arr.length + 8, 0);
        ctx.lineTo(-arr.length, 4);
        ctx.lineTo(-arr.length - 3, 4);
        ctx.lineTo(-arr.length + 3, 0);
        ctx.fillStyle = `rgba(202, 138, 4, ${arr.opacity * 0.85})`;
        ctx.fill();

        ctx.restore();
      });

      // Filter out inactive arrows
      for (let i = arrows.length - 1; i >= 0; i--) {
        if (!arrows[i].active) {
          arrows.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-75 dark:opacity-40"
    />
  );
};

export default ArcheryBackgroundAnimation;
