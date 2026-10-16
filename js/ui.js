// تفعيل شاشة الخطوط الإسكندرانية ومشاركة الواتساب والكاسيت
setTimeout(() => {
  const mStart = document.getElementById('m-start');
  const screenMenu = document.getElementById('screen-menu');
  const screenRoutes = document.getElementById('screen-routes');
  const rConfirm = document.getElementById('r-confirm');
  const rBack = document.getElementById('r-back');

  if (mStart && screenRoutes) {
    mStart.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      screenMenu.classList.add('hidden');
      screenRoutes.classList.remove('hidden');
    });

    rBack?.addEventListener('click', () => {
      screenRoutes.classList.add('hidden');
      screenMenu.classList.remove('hidden');
    });

    document.querySelectorAll('.route-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.route-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const price = card.querySelector('.route-price')?.textContent;
        const tag = document.getElementById('hud-route-tag');
        if (tag) tag.textContent = `📍 ${card.querySelector('.route-header span').textContent}`;
      });
    });

    rConfirm?.addEventListener('click', () => {
      screenRoutes.classList.add('hidden');
      // تشغيل الوردية الأصلية
      document.getElementById('hud')?.classList.remove('hidden');
      document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    });
  }

  // مشاركة الواتساب
  document.getElementById('m-share')?.addEventListener('click', () => {
    screenMenu.classList.add('hidden');
    document.getElementById('screen-share')?.classList.remove('hidden');
  });

  document.getElementById('share-back')?.addEventListener('click', () => {
    document.getElementById('screen-share')?.classList.add('hidden');
    screenMenu.classList.remove('hidden');
  });

  document.getElementById('btn-send-whatsapp')?.addEventListener('click', () => {
    const text = encodeURIComponent("تعالى العب معايا أجرة الكورنيش في إسكندرية! 🚖🔥\nhttps://khaledaliali552-cpu.github.io/corniche-cab/");
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    alert("مبروك! نزل في رصيدك 500 جنيه مكافأة 💰");
  });

  // مشغل الكاسيت
  const audio = document.getElementById('audio-player');
  const btnToggle = document.getElementById('btn-music-toggle');
  const title = document.getElementById('music-title');
  const tracks = [
    { name: "مهرجان إسكندراني 1", url: "audio/music/track1.mp3" },
    { name: "مهرجان على الكورنيش", url: "audio/music/track2.mp3" },
    { name: "شعبي روقان طريق البحر", url: "audio/music/track3.mp3" }
  ];
  let tIdx = 0;

  if (audio && btnToggle) {
    audio.src = tracks[0].url;
    if (title) title.textContent = tracks[0].name;

    btnToggle.onclick = () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btnToggle.textContent = '⏸';
      } else {
        audio.pause();
        btnToggle.textContent = '▶';
      }
    };

    document.getElementById('btn-music-next')?.addEventListener('click', () => {
      tIdx = (tIdx + 1) % tracks.length;
      audio.src = tracks[tIdx].url;
      if (title) title.textContent = tracks[tIdx].name;
      audio.play().catch(() => {});
      btnToggle.textContent = '⏸';
    });

    document.getElementById('btn-music-prev')?.addEventListener('click', () => {
      tIdx = (tIdx - 1 + tracks.length) % tracks.length;
      audio.src = tracks[tIdx].url;
      if (title) title.textContent = tracks[tIdx].name;
      audio.play().catch(() => {});
      btnToggle.textContent = '⏸';
    });
  }
}, 300);
