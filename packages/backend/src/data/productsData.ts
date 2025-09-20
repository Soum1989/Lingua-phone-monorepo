// backend/src/data/productsData.ts

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  gender?: string;
  url: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Travel Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    category: "travel_bag",
    url: "https://bazaar-market-place.netlify.app/products/1",
  },
  {
    id: "2",
    name: "Men's T-Shirt",
    price: 22.3,
    category: "t_shirts_men",
    url: "https://bazaar-market-place.netlify.app/products/2",
  },
  {
    id: "3",
    name: "Men's Jacket",
    price: 55.99,
    category: "jackets_men",
    url: "https://bazaar-market-place.netlify.app/products/3",
  },
  {
    id: "4",
    name: "Another Men's T-Shirt",
    price: 15.99,
    category: "t_shirts_men",
    url: "https://bazaar-market-place.netlify.app/products/4",
  },
  {
    id: "5",
    name: "Bracelet",
    price: 695,
    category: "jewellery_bracelet",
    url: "https://bazaar-market-place.netlify.app/products/5",
  },
  {
    id: "6",
    name: "Another Bracelet",
    price: 168.0,
    category: "jewellery_bracelet",
    url: "https://bazaar-market-place.netlify.app/products/6",
  },
  {
    id: "7",
    name: "Ring",
    price: 9.99,
    category: "jewellery_ring",
    url: "https://bazaar-market-place.netlify.app/products/7",
  },
  {
    id: "8",
    name: "Earrings",
    price: 10.99,
    category: "jewellery_earrings",
    url: "https://bazaar-market-place.netlify.app/products/8",
  },
  {
    id: "9",
    name: "WD Hard Drive",
    price: 64.0,
    category: "electronics_hard_drive",
    url: "https://bazaar-market-place.netlify.app/products/9",
  },
  {
    id: "10",
    name: "SanDisk Secondary Storage",
    price: 109.0,
    category: "electronics_secondary_storage",
    url: "https://bazaar-market-place.netlify.app/products/10",
  },
  {
    id: "11",
    name: "SP A55 Secondary Storage",
    price: 109.0,
    category: "electronics_secondary_storage",
    url: "https://bazaar-market-place.netlify.app/products/11",
  },
  {
    id: "12",
    name: "WD Gaming Hard Drive",
    price: 114.0,
    category: "electronics_hard_drive",
    url: "https://bazaar-market-place.netlify.app/products/12",
  },
  {
    id: "13",
    name: "Acer 21.5 inch Ultra thin Screen",
    price: 599.0,
    category: "electronics_screen",
    url: "https://bazaar-market-place.netlify.app/products/13",
  },
  {
    id: "14",
    name: "Samsung 49 inch Curved QLED",
    price: 999.99,
    category: "electronics_screen",
    url: "https://bazaar-market-place.netlify.app/products/14",
  },
  {
    id: "15",
    name: "BIYLACLESEN Women's 3-in-1 Winter Jacket",
    price: 56.99,
    category: "jacket_women",
    url: "https://bazaar-market-place.netlify.app/products/15",
  },
  {
    id: "16",
    name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    category: "jacket_women",
    url: "https://bazaar-market-place.netlify.app/products/16",
  },
  {
    id: "17",
    name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    category: "jacket_women",
    url: "https://bazaar-market-place.netlify.app/products/17",
  },
  {
    id: "18",
    name: "MBJ Women Solid Short Sleeve Boat Neck V",
    price: 9.85,
    category: "top_women",
    url: "https://bazaar-market-place.netlify.app/products/18",
  },
  {
    id: "19",
    name: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    category: "top_women",
    url: "https://bazaar-market-place.netlify.app/products/19",
  },
  {
    id: "20",
    name: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    category: "top_women",
    url: "https://bazaar-market-place.netlify.app/products/20",
  },
];
