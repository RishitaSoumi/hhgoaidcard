'use client';

import React, { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

export default function Home() {
  const [name, setName] = useState('ANONYMOUS');
  const [role, setRole] = useState('FULLSTACK ENGINEER');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let src: string;
      if (file.name.toLowerCase().endsWith('.heic')) {
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({ blob: file, toType: 'image/jpeg' });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        src = URL.createObjectURL(blob);
      } else {
        src = URL.createObjectURL(file);
      }
      setImageSrc(src);
      setPreviewReady(true);
    } catch {
      window.alert('Could not read that image. Please choose a PNG or JPG photo.');
    }
  };

  const drawPalm = (ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#167b52';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(3 * scale, -30 * scale, 8 * scale, -70 * scale);
    ctx.stroke();

    ctx.fillStyle = '#17865a';
    const leaves: Point[] = [
      { x: 8, y: -70 }, { x: 35, y: -83 }, { x: 43, y: -62 },
      { x: 25, y: -53 }, { x: -12, y: -84 }, { x: -20, y: -62 },
      { x: 2, y: -90 },
    ];
    leaves.forEach(({ x: lx, y: ly }, i) => {
      ctx.beginPath();
      ctx.ellipse(lx * scale, ly * scale, (i % 2 ? 28 : 34) * scale, 8 * scale, (i - 3) * 0.18, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 520;
    const height = 760;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    // Lanyard
    ctx.fillStyle = '#050505';
    ctx.fillRect(224, 0, 72, 235);
    ctx.fillStyle = '#ffe52b';
    ctx.font = '900 22px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(260, 116);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('HH GOA', 0, 0);
    ctx.restore();

    // Metal clip and cord
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(260, 238, 23, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = '#161616';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(260, 238);
    ctx.bezierCurveTo(247, 265, 277, 276, 260, 304);
    ctx.stroke();

    // Badge body
    const bx = 95;
    const by = 300;
    const bw = 330;
    const bh = 560;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#005a3a';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 18);
    ctx.fill();
    ctx.restore();

    // Illustrated upper half
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, 365, 18);
    ctx.clip();
    ctx.fillStyle = '#006943';
    ctx.fillRect(bx, by, bw, 365);

    // sunset
    ctx.fillStyle = '#f6d43d';
    ctx.beginPath();
    ctx.arc(260, 445, 49, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#e5c62f';
    ctx.lineWidth = 3;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(260 + i * 17, 405);
      ctx.lineTo(260 + i * 25, 382);
      ctx.stroke();
    }

    // ocean and beach
    ctx.fillStyle = '#00583b';
    ctx.fillRect(bx, 466, bw, 60);
    ctx.fillStyle = '#f5f3ea';
    ctx.beginPath();
    ctx.moveTo(bx, 505);
    ctx.quadraticCurveTo(150, 486, 205, 514);
    ctx.quadraticCurveTo(270, 540, 330, 511);
    ctx.quadraticCurveTo(375, 489, 425, 515);
    ctx.lineTo(425, 680);
    ctx.lineTo(bx, 680);
    ctx.closePath();
    ctx.fill();

    drawPalm(ctx, 395, 520, 0.82);
    drawPalm(ctx, 420, 570, 0.62);
    drawPalm(ctx, 112, 574, 0.58);

    // small beach huts
    ctx.fillStyle = '#f2f0e6';
    ctx.fillRect(115, 606, 72, 44);
    ctx.fillStyle = '#1a8b5a';
    ctx.beginPath();
    ctx.moveTo(105, 606);
    ctx.lineTo(150, 578);
    ctx.lineTo(198, 606);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f6d43d';
    ctx.fillRect(139, 625, 16, 25);

    ctx.fillStyle = '#f2f0e6';
    ctx.fillRect(338, 605, 55, 43);
    ctx.fillStyle = '#16865a';
    ctx.beginPath();
    ctx.moveTo(330, 605);
    ctx.lineTo(366, 580);
    ctx.lineTo(402, 605);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#075c3f';
    ctx.fillRect(358, 620, 13, 28);
    ctx.restore();

    // Header on card
    ctx.fillStyle = '#f4d13c';
    ctx.font = '900 43px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('HACKER', 260, 348);
    ctx.fillText('HOUSE', 260, 388);
    ctx.fillStyle = '#ef146f';
    ctx.font = '900 34px Arial Black, Arial, sans-serif';
    ctx.fillText('गोवा', 260, 381);

    // Profile photo circle
    const photoX = 260;
    const photoY = 506;
    const radius = 57;
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX, photoY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#f1f1f1';
    ctx.fill();
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        const size = Math.max(img.width, img.height);
        const scale = (radius * 2) / size;
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, photoX - dw / 2, photoY - dh / 2, dw, dh);
        ctx.restore();
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(photoX, photoY, radius, 0, Math.PI * 2);
        ctx.stroke();
        renderDetails(ctx, photoY + radius + 25);
      };
      img.src = imageSrc;
    } else {
      ctx.restore();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(photoX, photoY, radius, 0, Math.PI * 2);
      ctx.stroke();
      renderDetails(ctx, photoY + radius + 25);
    }
  };

  const renderDetails = (ctx: CanvasRenderingContext2D, startY: number) => {
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.font = '900 20px Arial Black, Arial, sans-serif';
    ctx.fillText((name || 'ANONYMOUS').toUpperCase().slice(0, 22), 260, startY);
    ctx.font = 'italic 700 14px Arial, sans-serif';
    ctx.fillText((role || 'FULLSTACK ENGINEER').toUpperCase().slice(0, 26), 260, startY + 25);
  };

  useEffect(() => {
    if (previewReady) drawCanvas();
  }, [name, role, imageSrc, previewReady]);

  const handleGenerate = () => {
    setPreviewReady(false);
    requestAnimationFrame(() => setPreviewReady(true));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCanvas();
    const link = document.createElement('a');
    link.download = `${(name || 'ANONYMOUS').replace(/\s+/g, '_')}_HH_Goa_2026.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = () => {
    handleDownload();
    const tweetText = encodeURIComponent(
      `Excited to build at Hacker House Goa 2026! Here is my official HH Goa ID. 🚀\n\n#FrameInGoa #HHGoa`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="hh-page">
      <section className="control-panel">
        <div className="intro">
          <h1><span>HH</span> GOA ID</h1>
          <p>Generate your official builder badge for Hacker<br />House Goa 2026.</p>
        </div>

        <div className="divider" />

        <div className="field-group upload-group">
          <label>PROFILE PHOTO</label>
          <label className="upload-box" htmlFor="profile-photo">
            <span className="upload-icon">↥</span>
            <span>Click to upload photo</span>
            <input
              id="profile-photo"
              type="file"
              accept="image/png,image/jpeg,image/heic"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="field-group">
          <label htmlFor="name">YOUR NAME</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="field-group">
          <label htmlFor="role">BUILDER ROLE</label>
          <input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>

        <button className="generate-button" onClick={handleGenerate}>GENERATE &amp; PREVIEW</button>

        <div className="action-row">
          <button className="download-button" onClick={handleDownload}>
            <span>⇩</span> DOWNLOAD
          </button>
          <button className="share-button" onClick={handleShare}>
            <span>♧</span> SHARE
          </button>
        </div>

        <div className="share-note">
          Clicking share will download the image and open X. Just paste the<br />
          image into the tweet!
        </div>
      </section>

      <section className="preview-panel">
        <div className="preview-canvas-wrap">
          <canvas ref={canvasRef} className="badge-canvas" aria-label="HH Goa ID badge preview" />
        </div>
      </section>
    </main>
  );
}
