export const SITE = {
  name: "AppTheta Ecom",
  phone: "01774029768",
  email: "qubiqsoft@gmail.com",
  address: "Dhaka, Bangladesh",
  marquee: "পুরো eCommerce Business Manage করুন একটি System থেকেই AppTheta Ecom",
  nav: [
    {
      label: "Home", to: "/", children: [
        { label: "Home Default", to: "/" },
        { label: "Shop", to: "/shop" },
        { label: "Product Details", to: "/product/2" },
        { label: "Track Order", to: "/track-order" },
        { label: "My Account", to: "/account" }
      ]
    },
    { label: "Shop", to: "/shop" },
    { label: "Combos", to: "/shop" },
    { label: "Home & Living", to: "/shop" },
    { label: "Accessories", to: "/shop" },
    { label: "Fashion", to: "/shop" },
    { label: "Checkout", to: "/checkout" },
    { label: "Cart", to: "/cart" },
    { label: "Blog", to: "/shop" },
    { label: "Offers", to: "/shop", hot: true }
  ]
};

export const PH_PRODUCT = "/assets/img/ph-product.svg";
export const PH_CATEGORY = "/assets/img/ph-category.svg";

export const CATEGORIES = [
  { name: "Accessories", slug: "accessories", sub: [] },
  { name: "Baby & Kids", slug: "baby-kids", sub: ["Toys"] },
  { name: "Beauty", slug: "beauty", sub: ["Fragrance", "Makeup", "Skincare"] },
  { name: "Beverages", slug: "beverages", sub: [] },
  { name: "demo category", slug: "demo-category", sub: [] },
  { name: "Electronics", slug: "electronics", sub: ["Mobile", "Gadget"] },
  { name: "Fashion", slug: "fashion", sub: ["Men", "Women"] },
  { name: "Grocery", slug: "grocery", sub: [] },
  { name: "Home & Living", slug: "home-living", sub: ["Furniture"] },
  { name: "Kitchen", slug: "kitchen", sub: [] }
].map((c) => ({ ...c, img: PH_CATEGORY }));

export const PRODUCTS = [
  { id: 1, name: "Lorem ipsum book seven", price: 300, old: 400, stock: false, cat: "grocery" },
  { id: 2, name: "Lorem ipsum book seven", price: 200, old: null, stock: true, cat: "beauty" },
  { id: 3, name: "Combo product show", price: 3300, old: null, stock: false, cat: "baby-kids" },
  { id: 4, name: "Skin1004 Madagascar Centella Hyalu Cica Water Fit Sunscreen 50ml", price: 520, old: 650, stock: true, cat: "beauty" },
  { id: 5, name: "Baby Rocking Chair with Mosquito Net – Comfortable", price: 2900, old: 3200, stock: false, cat: "baby-kids" },
  { id: 6, name: "Styles fashion women's bracelet Bohemian ethnic", price: 4821, old: 5413, stock: false, cat: "accessories" },
  { id: 7, name: "Nova | Narita | Nowake | Prestige Electric Blender", price: 1300, old: 1500, stock: false, cat: "kitchen" },
  { id: 8, name: "New Exquisite Collection - High-Quality Cotton Print", price: 600, old: 700, stock: false, cat: "fashion" },
  { id: 9, name: "50pcs Mix Color Lobster Clasp Cords Strap Charm", price: 350, old: 400, stock: false, cat: "accessories" },
  { id: 10, name: "Trendsetter -Upscale Living -New Trendy Look Very", price: 90, old: 100, stock: false, cat: "accessories" },
  { id: 11, name: "QFast BX01 (Imported) Ice Silk", price: 400, old: 450, stock: false, cat: "fashion" },
  { id: 12, name: "Sneakers For Men Shoes Running", price: 320, old: 350, stock: false, cat: "fashion" },
  { id: 13, name: "New Smart Watch Android IOS Phone 1.44 Inch Color", price: 7000, old: 7500, stock: false, cat: "electronics" },
  { id: 14, name: "Flower Embroidered Potli Bag for Holud Wedding", price: 900, old: 1000, stock: false, cat: "accessories" },
  { id: 15, name: "100% Organic Indigo powder for hair Colour", price: 400, old: 450, stock: false, cat: "beauty" },
  { id: 16, name: "Baby Winter Fleece Jumpsuit With Hood Girls", price: 2200, old: 2500, stock: false, cat: "baby-kids" },
  { id: 17, name: "Colorful Led Portable Desk Room Navy Blue With Min", price: 3700, old: 4000, stock: false, cat: "home-living" }
].map((p) => ({ ...p, img: PH_PRODUCT, gallery: [PH_PRODUCT, PH_PRODUCT, PH_PRODUCT], desc: p.name }));

export const money = (n) => "৳" + Number(n).toLocaleString("en-US");
export const discount = (p) => (p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0);
export const findProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
