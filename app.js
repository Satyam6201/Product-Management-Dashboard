let products = [];
let editIndex = null;
let isTableView = true;
let currentPage = 1;
const itemsPerPage = 5;
let searchTerm = "";
let debounceTimer = null;

document.getElementById("search").addEventListener("input", e => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    render();
  }, 500);
});

function toggleView() {
  isTableView = !isTableView;
  viewBtn.textContent = isTableView ? "📋 Table View" : "🧩 Card View";
  render();
}

function saveProduct() {
  const name = nameInput.value.trim();
  const price = priceInput.value;
  const category = categoryInput.value.trim();

  clearErrors();

  if (!name || !price || !category) {
    if (!name) nameError.textContent = "Name required";
    if (!price) priceError.textContent = "Price required";
    if (!category) categoryError.textContent = "Category required";
    return;
  }

  const product = {
    name,
    price,
    category,
    stock: stockInput.value,
    description: descriptionInput.value
  };

  if (editIndex !== null) {
    products[editIndex] = product;
    editIndex = null;
    formTitle.textContent = "➕ Add Product";
  } else {
    products.push(product);
  }

  clearForm();
  render();
}

function editProduct(index) {
  const p = products[index];
  nameInput.value = p.name;
  priceInput.value = p.price;
  categoryInput.value = p.category;
  stockInput.value = p.stock;
  descriptionInput.value = p.description;
  editIndex = index;
  formTitle.textContent = "✏️ Edit Product";
}

function render() {
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm)
  );

  if (!filtered.length) {
    productContainer.innerHTML = `<div class="empty">✨ No products found</div>`;
    pagination.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  productContainer.innerHTML = isTableView
    ? tableView(paginated)
    : cardView(paginated);

  renderPagination(filtered.length);
}

function tableView(data) {
  return `
    <div class="table-view">
      <table>
        <tr>
          <th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Action</th>
        </tr>
        ${data.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>₹${p.price}</td>
            <td>${p.category}</td>
            <td>${p.stock || "-"}</td>
            <td><button class="edit" onclick="editProduct(${products.indexOf(p)})">Edit</button></td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
}

function cardView(data) {
  return `
    <div class="card-view">
      ${data.map(p => `
        <div class="card">
          <h4>${p.name}</h4>
          <p>💰 ₹${p.price}</p>
          <p>📦 ${p.category}</p>
          <p>📊 ${p.stock || "-"}</p>
          <button class="edit" onclick="editProduct(${products.indexOf(p)})">Edit</button>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPagination(total) {
  const pages = Math.ceil(total / itemsPerPage);
  pagination.innerHTML = "";
  for (let i = 1; i <= pages; i++) {
    pagination.innerHTML += `<button onclick="currentPage=${i};render()">${i}</button>`;
  }
}

function clearForm() {
  nameInput.value = priceInput.value = categoryInput.value =
  stockInput.value = descriptionInput.value = "";
}

function clearErrors() {
  nameError.textContent = priceError.textContent = categoryError.textContent = "";
}

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const stockInput = document.getElementById("stock");
const descriptionInput = document.getElementById("description");
const productContainer = document.getElementById("productContainer");
const pagination = document.getElementById("pagination");
const nameError = document.getElementById("nameError");
const priceError = document.getElementById("priceError");
const categoryError = document.getElementById("categoryError");
const formTitle = document.getElementById("formTitle");
const viewBtn = document.getElementById("viewBtn");

render();