export interface Plant {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock: boolean;
  rating: number;
}

export const MOCK_PLANTS: Plant[] = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    description: 'Planta tropical con hojas grandes y vistosas',
    price: 45.99,
    category: 'interior',
    inStock: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Pothos/Epipremnum',
    description: 'Ideal para principiantes, muy resistente',
    price: 24.99,
    category: 'interior',
    inStock: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Cactus Echinocereus',
    description: 'Bajo mantenimiento, perfecto para escritorio',
    price: 19.99,
    category: 'exterior',
    inStock: true,
    rating: 4.5,
  },
  {
    id: 4,
    name: 'Orquídea Phalaenopsis',
    description: 'Elegante y duradera, flores hermosas',
    price: 59.99,
    category: 'interior',
    inStock: true,
    rating: 5.0,
  },
  {
    id: 5,
    name: 'Helecho de Boston',
    description: 'Planta exuberante de aspecto verde intenso',
    price: 34.99,
    category: 'interior',
    inStock: true,
    rating: 4.6,
  },
  {
    id: 6,
    name: 'Suculenta Echeveria',
    description: 'Variedad de colores, muy decorativa',
    price: 15.99,
    category: 'exterior',
    inStock: true,
    rating: 4.7,
  },
  {
    id: 7,
    name: 'Palmera Areca',
    description: 'Gran y majestuosa, tropical',
    price: 89.99,
    category: 'interior',
    inStock: false,
    rating: 4.8,
  },
  {
    id: 8,
    name: 'Ave del Paraíso',
    description: 'Naranja brillante, muy especial',
    price: 54.99,
    category: 'interior',
    inStock: true,
    rating: 4.9,
  },
  {
    id: 9,
    name: 'Lirio de Paz',
    description: 'Blanca elegante, purifica el aire',
    price: 39.99,
    category: 'interior',
    inStock: true,
    rating: 4.7,
  },
  {
    id: 10,
    name: 'Dracaena Fragrans',
    description: 'Líneas verdes elegantes',
    price: 44.99,
    category: 'interior',
    inStock: true,
    rating: 4.6,
  },
  {
    id: 11,
    name: 'Bambú de la Suerte',
    description: 'Símbolo de buenos augurios',
    price: 29.99,
    category: 'interior',
    inStock: true,
    rating: 4.8,
  },
  {
    id: 12,
    name: 'Monstera Deliciosa Variegada',
    description: 'Variedades raras y especiales',
    price: 149.99,
    category: 'interior',
    inStock: true,
    rating: 5.0,
  },
];
