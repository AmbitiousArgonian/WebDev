import $ from "jquery";
import {Html5QrcodeScanner} from "html5-qrcode";





// --- Barcode Scanner Initialisierung ---
// --- Event Listener für den Search-Button ---
$('#searchBtn').on('click', async () => {
  const barcode = $('#barcodeInput').val() as string;

  if (!barcode) {
    alert("Please enter a barcode first!");
    return;
  }

  // API-Aufruf
  const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
  console.log("Fetching:", apiUrl);

  try {
    const response = await $.get(apiUrl);
    const product = response.product;

    if (!product) {
      $('#result').html(`<div class="alert alert-warning">Product not found.</div>`);
      return;
    }

    // Produktinformationen zusammenstellen
    const html = `
      <div class="card shadow-sm">
        <img src="${product.image_front_small_url || ''}" class="card-img-top" alt="${product.product_name}" />
        <div class="card-body">
          <h5 class="card-title">${product.product_name || 'Unknown Product'}</h5>
          <p class="card-text">Calories: ${product.nutriments['energy-kcal'] || 'n/a'} kcal</p>
          <p>Proteins: ${product.nutriments.proteins || 'n/a'} g</p>
          <p>Carbs: ${product.nutriments.carbohydrates || 'n/a'} g</p>
          <p>Fats: ${product.nutriments.fat || 'n/a'} g</p>
        </div>
      </div>
    `;

    $('#result').html(html);
  } catch (error) {
    console.error("API Error:", error);
    $('#result').html(`<div class="alert alert-danger">Error fetching data.</div>`);
  }
});
