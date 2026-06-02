export type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Cafe = {
  slug: string;
  name: string;
  description: string;
  chatId: string;
  image: string;
  menu: MenuCategory[];
};

export const cafes: Record<string, Cafe> = {


  hamburg: {
    slug: "hamburg",
    name: "Hamburg",
    description: "Шаурма, донеры, напитки",
    chatId: "-5273899800",
    image: "/cafes/hamburg/main_img/hamburg_main_img.jpg",
    menu: [
      {
        id: "Pizza",
        name: "Пиццы",
        items: [
          { id: 1, name: "Пицца Цезарь", price: 970, image: "/cafes/hamburg/pizzas/pizza_cizar.jpg" },
          { id: 2, name: "Пицца Бьянко", price: 970, image: "/cafes/hamburg/pizzas/pizza_bianko.jpg" },
          { id: 3, name: "Пицца Hamburg", price: 970, image: "/cafes/hamburg/pizzas/pizza_hamburg.jpg" },
          { id: 4, name: "Пицца 4 сыра", price: 810, image: "/cafes/hamburg/pizzas/pizza_4chees.jpg" },
        ],
      },
      {
        id: "fastfood",
        name: "🌯 Фастфуд",
        items: [
          { id: 1, name: "Шаурма классическая", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
          { id: 2, name: "Донер с курицей", price: 220, image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=400" },
        ],
      },
      {
        id: "drinks",
        name: "🥤 Напитки",
        items: [
          { id: 3, name: "Кола 0.5", price: 90, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
          { id: 4, name: "Вода 0.5", price: 50, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400" },
        ],
      },
    ],
  },


  hashus: {
    slug: "hashus",
    name: "Has Hus",
    description: "Пицца и фастфуд",
    chatId: "-5126815494",
    image: "/cafes/hashus/main_img/hashus_main_img.jpg",
    menu: [
      {
        id: "fastfood",
        name: "🌯 Фастфуд",
        items: [
          { id: 1, name: "Шаурма классическая", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
          { id: 2, name: "Донер с курицей", price: 220, image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=400" },
        ],
      },
      {
        id: "drinks",
        name: "🥤 Напитки",
        items: [
          { id: 3, name: "Кола 0.5", price: 90, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
          { id: 4, name: "Вода 0.5", price: 50, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400" },
        ],
      },
    ],
  },


  starburg: {
    slug: "starburg",
    name: "StarBurg",
    description: "Пицца и фастфуд",
    chatId: "-5126815494",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    menu: [
      {
        id: "fastfood",
        name: "🌯 Фастфуд",
        items: [
          { id: 1, name: "Шаурма классическая", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
          { id: 2, name: "Донер с курицей", price: 220, image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=400" },
        ],
      },
      {
        id: "drinks",
        name: "🥤 Напитки",
        items: [
          { id: 3, name: "Кола 0.5", price: 90, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
          { id: 4, name: "Вода 0.5", price: 50, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400" },
        ],
      },
    ],
  },


  bairam: {
    slug: "bairam",
    name: "Bairam",
    description: "Суши",
    chatId: "-5126815494",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    menu: [
      {
        id: "fastfood",
        name: "🌯 Фастфуд",
        items: [
          { id: 1, name: "Шаурма классическая", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400" },
          { id: 2, name: "Донер с курицей", price: 220, image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=400" },
        ],
      },
      {
        id: "drinks",
        name: "🥤 Напитки",
        items: [
          { id: 3, name: "Кола 0.5", price: 90, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
          { id: 4, name: "Вода 0.5", price: 50, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400" },
        ],
      },
    ],
  },



};

export function getCafe(slug: string): Cafe | null {
  return cafes[slug] ?? null;
}