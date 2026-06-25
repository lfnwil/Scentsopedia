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
        const pricePer100ml = fragrance.pricePer100ml
          ? ` - ${fragrance.pricePer100ml} EUR / 100ml`
          : '';

        listItem.textContent = `${fragrance.name} - ${brandName} - ${fragrance.price} EUR${pricePer100ml} - Notes: ${topNote}, ${heartNote}, ${baseNote}`;
        fragrancesList.appendChild(listItem);
      });
    }
  });
