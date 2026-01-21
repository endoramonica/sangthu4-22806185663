// ==========================
// Câu 1: Constructor Product
// ==========================
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// ==========================
// Câu 2: Khởi tạo mảng products (>=6 SP, >=2 danh mục)
// ==========================
const products = [
    new Product(1, "iPhone 15 Pro", 35000000, 10, "Phone", true),
    new Product(2, "Samsung Galaxy S23", 28000000, 0, "Phone", true),
    new Product(3, "MacBook Pro M2", 42000000, 5, "Laptop", true),
    new Product(4, "Dell XPS 13", 32000000, 3, "Laptop", false),
    new Product(5, "AirPods Pro", 6500000, 15, "Accessories", true),
    new Product(6, "Magic Mouse", 3000000, 0, "Accessories", false),
];

// ==========================
// Câu 3: Mảng mới chỉ chứa name, price
// ==========================
const nameAndPrice = products.map(p => ({
    name: p.name,
    price: p.price
}));

// ==========================
// Câu 4: Lọc sản phẩm còn hàng (quantity > 0)
// ==========================
const inStockProducts = products.filter(p => p.quantity > 0);

// ==========================
// Câu 5: Có ít nhất 1 SP giá > 30.000.000?
// ==========================
const hasExpensiveProduct = products.some(p => p.price > 30000000);

// ==========================
// Câu 6: Tất cả sản phẩm "Accessories" có đang bán?
// ==========================
const allAccessoriesAvailable = products
    .filter(p => p.category === "Accessories")
    .every(p => p.isAvailable === true);

// ==========================
// Câu 7: Tính tổng giá trị kho hàng
// ==========================
const totalInventoryValue = products.reduce(
    (total, p) => total + p.price * p.quantity,
    0
);

// ==========================
// Câu 8: for...of duyệt mảng products
// ==========================
let output = "";
for (const product of products) {
    output += `${product.name} - ${product.category} - ${
        product.isAvailable ? "Đang bán" : "Ngừng bán"
    }\n`;
}

// ==========================
// Câu 9: for...in in tên thuộc tính & giá trị
// ==========================
output += "\nChi tiết sản phẩm đầu tiên:\n";
for (const key in products[0]) {
    output += `${key}: ${products[0][key]}\n`;
}

// ==========================
// Câu 10: Tên SP đang bán và còn hàng
// ==========================
const sellingAndInStockNames = products
    .filter(p => p.isAvailable && p.quantity > 0)
    .map(p => p.name);

// ==========================
// Hiển thị kết quả
// ==========================
output += "\nMảng name & price:\n" + JSON.stringify(nameAndPrice, null, 2);
output += "\n\nCòn hàng:\n" + JSON.stringify(inStockProducts, null, 2);
output += "\n\nCó SP > 30 triệu: " + hasExpensiveProduct;
output += "\nTất cả Accessories đang bán: " + allAccessoriesAvailable;
output += "\nTổng giá trị kho: " + totalInventoryValue.toLocaleString("vi-VN") + " VND";
output += "\n\nSP đang bán và còn hàng:\n" + sellingAndInStockNames.join(", ");

document.getElementById("output").textContent = output;
