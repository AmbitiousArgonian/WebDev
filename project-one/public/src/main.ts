import $ from "jquery";
import {Html5QrcodeScanner} from "html5-qrcode";





// --- Barcode Scanner Initialisierung ---
  $('#scanBtn').on('click', () =>
    {
    $('#reader').html('');
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
      );
    const onScanSuccess = (decodedText: string , decodedResult: any) =>
      {
       $('#barcodeInput').val(decodedText);
       scanner.clear();
       $('#searchBtn').trigger('click'); // Suche automatisch auslösen um such klick einzusparen
       };
  scanner.render(onScanSuccess, undefined); // todo: onScanError Zukunftsproblem
    });

// --- Event Listener für den Search-Button ---
$('#searchBtn').on('click', async () =>
  {
  const barcode = $('#barcodeInput').val() as string;

  if (!barcode)
    {
    alert("Please enter a barcode first!");
    return;
   }

  // API-Aufruf
  const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
  console.log("Fetching:", apiUrl);

  try
  {
    const response = await $.get(apiUrl);
    const product = response.product;

    if (!product)
    { 
      $('#result').html(`<div class="alert alert-warning">Product not found.</div>`);
      return;
    }
    //Zutaten extrahieren und lesbar machen
    const ingredients = product.ingredients_hierarchy || [];
    const topIngredients = ingredients.slice(0, 3);
    const readableIngredients = topIngredients
        .map((i: string) => i.replace('en:', '').replace('de:', '')) // Sprachpräfixe entfernen um Lesbarkeit zu verbessern
        .join(', ');
    // Produktinformationen zusammenstellen
    const html = `
      <div class="card shadow-sm">
        <img src="${product.image_front_small_url || ''}" class="card-img-top" alt="${product.product_name}" />
        <div class="card-body">
          <h5 class="card-title">${product.product_name || 'Unknown Product'}</h5>
          <p>Nutriscore: ${(product.nutriscore_grade ?? '').toString().toUpperCase() || 'N/A'}  </p>
          <p>Ecocore: ${(product.ecoscore_grade ?? '').toString().toUpperCase() || 'N/A'}  </p>
          <p>Calories: ${product.nutriments['energy-kcal'] || 'N/A'} kcal</p>
          <p>Proteins: ${product.nutriments.proteins || 'N/A'} g</p>
          <p>Carbs: ${product.nutriments.carbohydrates || 'N/A'} g</p>
          <p>Fats: ${product.nutriments.fat || 'N/A'} g</p>
          <p><strong>Main Ingredients:</strong> ${readableIngredients}</p>
        </div>
      </div>
    `;

    $('#result').html(html);
  } catch (error)
  {
    console.error("API Error:", error);
    $('#result').html(`<div class="alert alert-danger">Error fetching data.</div>`);
  }
});
