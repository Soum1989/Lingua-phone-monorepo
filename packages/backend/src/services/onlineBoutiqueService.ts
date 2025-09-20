import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  picture: string;
  priceUsd: {
    currencyCode: string;
    units: number;
    nanos: number;
  };
  categories: string[];
}

interface CartItem {
  productId: string;
  quantity: number;
}

// FakeStoreAPI product interface
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export class OnlineBoutiqueService {
  private baseUrl: string;
  private fakeStoreApiUrl: string;

  constructor() {
    this.baseUrl = process.env.ONLINE_BOUTIQUE_URL || 'http://frontend-external';
    this.fakeStoreApiUrl = 'https://fakestoreapi.com';
  }

  // Product Catalog
  async getProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<FakeStoreProduct[]>(`${this.fakeStoreApiUrl}/products`);
      return response.data.map((p) => ({
        id: p.id.toString(),
        name: p.title,
        description: p.description,
        picture: p.image,
        priceUsd: {
          currencyCode: 'USD',
          units: Math.floor(p.price),
          nanos: Math.round((p.price % 1) * 1_000_000_000),
        },
        categories: [p.category],
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      throw new Error('Failed to fetch products');
    }
  }

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const response = await axios.get<FakeStoreProduct>(`${this.fakeStoreApiUrl}/products/${productId}`);
      return {
        id: response.data.id.toString(),
        name: response.data.title,
        description: response.data.description,
        picture: response.data.image,
        priceUsd: {
          currencyCode: 'USD',
          units: Math.floor(response.data.price),
          nanos: Math.round((response.data.price % 1) * 1_000_000_000),
        },
        categories: [response.data.category],
      };
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  }

  // 🔎 Search Products
  async searchProducts(query: string, language: string = 'en'): Promise<Product[]> {
    // Toggle between MOCK search and API search
    const useMock = true;

    if (useMock) {
      const allProducts: Product[] = [
        {
          id: '1',
          name: "Travel Fjallraven - Foldsack No. 1 Backpack",
          description: 'Your perfect pack for everyday use and walks in the forest.',
          picture: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 109,
            nanos: 950000000,
          },
          categories: ['travel_bag'],
        },
        {
          id: '2',
          name: "Men's T-Shirt",
          description: 'Slim-fitting style, contrast raglan long sleeve.',
          picture: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 22,
            nanos: 300000000,
          },
          categories: ['t_shirts_men'],
        },
        {
          id: '3',
          name: "Men's Jacket",
          description: 'Great outerwear jackets for Spring/Autumn/Winter.',
          picture: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 55,
            nanos: 990000000,
          },
          categories: ['jackets_men'],
        },
        {
          id: '4',
          name: "Another Men's T-Shirt",
          description: 'Classic fit, crew neck, short sleeve t-shirt.',
          picture: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 15,
            nanos: 990000000,
          },
          categories: ['t_shirts_men'],
        },
        {
          id: '5',
          name: 'Bracelet',
          description: 'From our Legends Collection, the Naga was inspired by the mythical water dragon.',
          picture: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 695,
            nanos: 0,
          },
          categories: ['jewellery_bracelet'],
        },
        {
          id: '6',
          name: 'Another Bracelet',
          description: 'Elegant design with premium materials.',
          picture: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 168,
            nanos: 0,
          },
          categories: ['jewellery_bracelet'],
        },
        {
          id: '7',
          name: 'Ring',
          description: 'Classic ring with beautiful finish.',
          picture: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 9,
            nanos: 990000000,
          },
          categories: ['jewellery_ring'],
        },
        {
          id: '8',
          name: 'Earrings',
          description: 'Stylish earrings for any occasion.',
          picture: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 10,
            nanos: 990000000,
          },
          categories: ['jewellery_earrings'],
        },
        {
          id: '9',
          name: 'WD Hard Drive',
          description: 'Expand your PS4 gaming experience, Play anywhere.',
          picture: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 64,
            nanos: 0,
          },
          categories: ['electronics_hard_drive'],
        },
        {
          id: '10',
          name: 'SanDisk Secondary Storage',
          description: 'USB 3.0 and USB 2.0 Compatibility.',
          picture: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 109,
            nanos: 0,
          },
          categories: ['electronics_secondary_storage'],
        },
        {
          id: '11',
          name: 'SP A55 Secondary Storage',
          description: 'High performance with wide compatibility.',
          picture: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 109,
            nanos: 0,
          },
          categories: ['electronics_secondary_storage'],
        },
        {
          id: '12',
          name: 'WD Gaming Hard Drive',
          description: 'Designed to enhance your gaming experience.',
          picture: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_UY879_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 114,
            nanos: 0,
          },
          categories: ['electronics_hard_drive'],
        },
        {
          id: '13',
          name: 'Acer 21.5 inch Ultra thin Screen',
          description: '21.5 inches Full HD (1920 x 1080) widescreen IPS display.',
          picture: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 599,
            nanos: 0,
          },
          categories: ['electronics_screen'],
        },
        {
          id: '14',
          name: 'Samsung 49 inch Curved QLED',
          description: 'Quantum Dot technology, HDR support, and smart TV features.',
          picture: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 999,
            nanos: 990000000,
          },
          categories: ['electronics_screen'],
        },
        {
          id: '15',
          name: "BIYLACLESEN Women's 3-in-1 Winter Jacket",
          description: 'Warm and comfortable, suitable for winter.',
          picture: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 56,
            nanos: 990000000,
          },
          categories: ['jacket_women'],
        },
        {
          id: '16',
          name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
          description: 'Stylish biker jacket with removable hood.',
          picture: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 29,
            nanos: 950000000,
          },
          categories: ['jacket_women'],
        },
        {
          id: '17',
          name: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
          description: 'Lightweight and waterproof, perfect for outdoor activities.',
          picture: 'https://fakestoreapi.com/img/71HblAHs5ML._AC_UY879_-2.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 39,
            nanos: 990000000,
          },
          categories: ['jacket_women'],
        },
        {
          id: '18',
          name: 'MBJ Women Solid Short Sleeve Boat Neck V',
          description: '95% RAYON 5% SPANDEX, Made in USA or Imported.',
          picture: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 9,
            nanos: 850000000,
          },
          categories: ['top_women'],
        },
        {
          id: '19',
          name: "Opna Women's Short Sleeve Moisture",
          description: '100% Polyester, Machine wash, 100% cationic polyester interlock.',
          picture: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 7,
            nanos: 950000000,
          },
          categories: ['top_women'],
        },
        {
          id: '20',
          name: 'DANVOUY Womens T Shirt Casual Cotton Short',
          description: '95%Cotton,5%Spandex, Features: Casual, Short Sleeve.',
          picture: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg',
          priceUsd: {
            currencyCode: 'USD',
            units: 12,
            nanos: 990000000,
          },
          categories: ['top_women'],
        },
      ];
      return allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    }

    // 🔹 Else use API search
    try {
      const products = await this.getProducts();
      const { translateText } = await import('./translationService');
      const englishQuery = language !== 'en' ? await translateText(query, language, 'en') : query;

      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(englishQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(englishQuery.toLowerCase()) ||
          p.categories.some((c) => c.toLowerCase().includes(englishQuery.toLowerCase())),
      );
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  }

  // Cart Operations
  async addToCart(userId: string, productId: string, quantity: number): Promise<boolean> {
    console.log(`Adding product ${productId} to cart for user ${userId} with qty ${quantity}`);
    return true;
  }

  async getCart(userId: string): Promise<CartItem[]> {
    console.log(`Fetching cart for user ${userId}`);
    return [];
  }

  // Recommendations
  async getRecommendations(userId: string, productId?: string): Promise<string[]> {
    const products = await this.getProducts();
    return products.slice(0, 5).map((p) => p.id);
  }

  // Multilingual Product Info
  async getProductInLanguage(productId: string, language: string): Promise<Product | null> {
    const product = await this.getProduct(productId);
    if (!product || language === 'en') return product;

    const { translateText } = await import('./translationService');
    return {
      ...product,
      name: await translateText(product.name, 'en', language),
      description: await translateText(product.description, 'en', language),
    };
  }

  // Cultural Price Formatting
  async formatPrice(price: any, language: string): Promise<string> {
    const amount = price.units + price.nanos / 1_000_000_000;
    const formatter = new Intl.NumberFormat(language || 'en-US', { style: 'currency', currency: 'USD' });
    return formatter.format(amount);
  }

  // Shopping Context
  async getShoppingContext(userId: string) {
    return {
      cart: await this.getCart(userId),
      recentViews: await this.getRecentViews(userId),
      preferences: await this.getUserPreferences(userId),
    };
  }

  private async getRecentViews(userId: string): Promise<string[]> {
    return ['1', '2', '3'];
  }

  private async getUserPreferences(userId: string): Promise<any> {
    return {
      preferredCategories: ['electronics', 'jewelery', "men's clothing", "women's clothing"],
      priceRange: { min: 10, max: 100 },
      language: 'en',
    };
  }
}

export default OnlineBoutiqueService;
