fetch('data_by_year.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('malla');
    const allMaterias = {};

    Object.entries(data).forEach(([año, materias]) => {
      if (año.toLowerCase().includes("ciclo")) return;

      const column = document.createElement('div');
      column.className = 'year-column';

      const title = document.createElement('div');
      title.className = 'year-title';
      title.textContent = año;
      column.appendChild(title);

      materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = 'materia';
        div.id = materia.codigo;

        div.innerHTML = `
          <div class="codigo">${materia.codigo}</div>
          <div class="nombre">${materia.nombre}</div>
        `;
        column.appendChild(div);
        allMaterias[materia.codigo] = div;

        // Interactividad al hacer clic
        div.addEventListener('click', () => {
          // Limpiar resaltado
          document.querySelectorAll('.materia').forEach(m => m.classList.remove('highlight'));
          div.classList.add('highlight');
          (materia.correlativas || []).forEach(cod => {
            if (allMaterias[cod]) allMaterias[cod].classList.add('highlight');
          });
        });
      });

      container.appendChild(column);
    });

    // Dibujar líneas entre materias y sus correlativas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function drawLines() {
      const rect = document.body.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#7a5c39';
      ctx.lineWidth = 2;

      Object.entries(data).forEach(([, materias]) => {
        materias.forEach(materia => {
          const fromEl = allMaterias[materia.codigo];
          if (!fromEl || !materia.correlativas) return;
          materia.correlativas.forEach(cod => {
            const toEl = allMaterias[cod];
            if (!toEl) return;
            const rect1 = fromEl.getBoundingClientRect();
            const rect2 = toEl.getBoundingClientRect();
            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2 + window.scrollY;
            const x2 = rect2.left + rect2.width / 2;
            const y2 = rect2.top + rect2.height / 2 + window.scrollY;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          });
        });
      });
    }

    window.addEventListener('load', drawLines);
    window.addEventListener('resize', drawLines);
    window.addEventListener('scroll', drawLines);
  });
