"use strict";

import { fetchProducts, fetchCategories } from "./functions";
import { saveVotes, getVotes } from "./firebase";

let enableForm = () =>{
    const form = document.getElementById("form_voting");
    if(form){
        form.addEventListener("submit",(event) => {
            event.preventDefault();

            const productId = document.getElementById("select_product").value;

            saveVotes(productId).then(response => {
                if (response.status){
                    alert(response.message);
                    displayVotes();
                }
                else{
                    alert(response.message);
                }
            });
        });
    }
};

let displayVotes = async () => {
  const container = document.getElementById('results');
  if (!container) return;

  container.innerHTML = 'Cargando...';

  const { status, data, message } = await getVotes();
  if (!status) {
    container.innerHTML = message || 'Sin datos.';
    return;
  }


  const counts = {};
  for (const key in data) {
    const vote = data[key];
    const pid = vote?.productId ?? vote?.productID ?? 'Desconocido';

    counts[pid] = (counts[pid] || 0) + 1;
  }


  if (Object.keys(counts).length === 0) {
    container.innerHTML = 'Sin datos.';
    return;
  }

 
  let rows = '';
  for (const prod in counts) {
    rows += `<tr><td>${prod}</td><td>${counts[prod]}</td></tr>`;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Total de votos</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};


let renderProducts = () => {


    fetchProducts("https://data-dawm.github.io/datum/reseller/products.json")
        .then(result => {
            if (result.success == true) {

                let container = document.getElementById("products-container");
                container.innerHTML = "";

                let products = result.body.slice(0, 6);

                products.forEach(product => {




                    let productHTML = `
   <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
       <img
           class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
           src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
       <h3
           class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
           $[PRODUCT.PRICE]
       </h3>

       <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
           <div class="space-y-2">
               <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
               class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                   Ver en Amazon
               </a>
               <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
           </div>
       </div>
   </div>`;

                    productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title);

                    productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id);

                    productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price);

                    productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl);



                    container.innerHTML += productHTML;

                });

            }
            throw new Error(result.success);

        })
        .catch(error => {
            return {
                success: false,
                body: error.message
            };

        });
};



let renderCategories = async () => {

    try {
        let result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');
        if (result.success == true) {
            let container = document.getElementById("categories");
            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

            let categoriesXML = result.body;
            let categories = categoriesXML.getElementsByTagName("category");

            for (let category of categories) {

                let categoryHTML = `<option value="[ID]">[NAME]</option>`;
                let id = category.getElementsByTagName("id")[0].textContent;
                let name = category.getElementsByTagName("name")[0].textContent;

                categoryHTML = categoryHTML.replace("[ID]", id);
                categoryHTML = categoryHTML.replace("[NAME]", name);

                container.innerHTML += categoryHTML;

            };
        }
    }
    catch (error) {
        return {
            success: false,
            body: error.message
        };
    }
}





(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

/**
 * Muestra el toast agregando la clase "md:block" al elemento con id "toast-interactive".
 */

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};


/**
 * Agrega un listener al elemento con id "demo" que al hacer clic abre un video de YouTube en una nueva pestaña.
 */

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
    enableForm();
    displayVotes();
})();