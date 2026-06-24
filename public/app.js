document.addEventListener('DOMContentLoaded', async function() {
    const fragrancesList = document.getElementById('fragrances-list');

    if (fragrancesList) {
      const response = await fetch('/api/v1/fragrances');
      const fragrances = await response.json();

      fragrances.forEach(fragrance => {
        const listItem = document.createElement('li');
        const brandName = fragrance.Brand?.name ?? 'Marque inconnue';
        const topNote = fragrance.topNote?.name ?? 'note inconnue';
        const heartNote = fragrance.heartNote?.name ?? 'note inconnue';
        const baseNote = fragrance.baseNote?.name ?? 'note inconnue';

        listItem.textContent = `${fragrance.name} - ${brandName} - ${fragrance.price} EUR - Notes: ${topNote}, ${heartNote}, ${baseNote}`;
        fragrancesList.appendChild(listItem);
      });
    }
  });
