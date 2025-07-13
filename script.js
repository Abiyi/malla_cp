fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('malla');
    data.forEach(materia => {
      const div = document.createElement('div');
      div.className = 'materia';
      div.innerHTML = `
        <div class="codigo">${materia.codigo}</div>
        <div class="nombre">${materia.nombre}</div>
        <div class="correlativas">
          <strong>Correlativas:</strong> ${
            materia.correlativas.length ? materia.correlativas.join(', ') : 'Ninguna'
          }
        </div>
      `;
      container.appendChild(div);
    });
  });
