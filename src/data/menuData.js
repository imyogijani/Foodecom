// Shared menu data for all restaurant pages
// This ensures consistency across Restaurant page, Track Order page, and other menu pages

export const restaurantInfo = {
  name: "Tandoori Pizza London",
  description: "Best flavours with a blend of Italian sweetness",
  rating: 3.4,
  reviews: 1360,
  minOrder: "£12.00",
  deliveryTime: "20-25 Minutes",
  phone: "+934443-43",
  website: "http://tandooripizza.uk/",
  address: "Tooley St, London Bridge, London SE1 2TF, United Kingdom",
  operationalHours: {
    monday: "12:00 AM–3:00 AM, 8:00 AM–3:00 AM",
    tuesday: "8:00 AM–3:00 AM",
    wednesday: "8:00 AM–3:00 AM",
    thursday: "8:00 AM–3:00 AM",
    friday: "8:00 AM–3:00 AM",
    saturday: "8:00 AM–3:00 AM",
    sunday: "8:00 AM–12:00 AM",
  },
};

export const menuCategories = [
  "Offers",
  "Pizzas",
  "Garlic Bread",
  "Calzone",
  "Kebabs",
  "Salads",
  "Cold drinks",
  "Happy Meal®",
  "Desserts",
  "Hot drinks",
  "Sauces",
  "Orbit®",
];

export const offerItems = [
  {
    id: "offer-1",
    title: "First Order Discount",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    discount: "-20%",
    restaurant: "Tandoori Pizza London",
    badge: "NEW",
    price: "£15.90",
    originalPrice: "£19.90",
  },
  {
    id: "offer-2",
    title: "Vegan Discount",
    image:
      "https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=400",
    discount: "-20%",
    restaurant: "Tandoori Pizza London",
    badge: "POPULAR",
    price: "£12.90",
    originalPrice: "£16.90",
  },
  {
    id: "offer-3",
    title: "Free ice Cream Offer",
    image:
      "https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=400",
    discount: "-100%",
    restaurant: "Tandoori Pizza London",
    badge: "LIMITED",
    price: "£0.00",
    originalPrice: "£4.90",
  },
];

export const pizzaItems = [
  {
    id: "pizza-1",
    title: "Farm House Xtreme Pizza",
    rating: 4.5,
    ratingCount: 5,
    spiceLevel: 3,
    desc: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 2 medium sized French Fries, 3 cold drinks",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    calories: "850 cal",
    sizes: [
      { name: "Small", price: "£19.90" },
      { name: "Medium", price: "£29.90" },
      { name: "Large", price: "£27.90" },
    ],
    xlOption: { name: "XL Large with Sauces", price: "£32.90" },
  },
  {
    id: "pizza-2",
    title: "Deluxe Pizza",
    rating: 4.3,
    ratingCount: 5,
    spiceLevel: 4,
    desc: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 2 medium sized French Fries, 3 cold drinks",
    image:
      "https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    calories: "720 cal",
    sizes: [
      { name: "Small", price: "£24.90" },
      { name: "Medium", price: "£34.90" },
      { name: "Large", price: "£31.90" },
    ],
    xlOption: { name: "XL Large with Sauces", price: "£35.90" },
  },
  {
    id: "pizza-3",
    title: "Tandoori Pizza",
    rating: 4.7,
    ratingCount: 5,
    spiceLevel: 5,
    desc: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 2 medium sized French Fries, 3 cold drinks",
    image:
      "https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    calories: "680 cal",
    badge: "SPECIAL",
    promoText: "-20%",
    sizes: [
      { name: "Small", price: "£19.90" },
      { name: "Medium", price: "£29.90" },
      { name: "Large", price: "£27.90" },
    ],
    xlOption: { name: "XL Large with Sauces", price: "£32.90" },
  },
  {
    id: "pizza-4",
    title: "Margherita Pizza",
    rating: 4.6,
    ratingCount: 5,
    spiceLevel: 1,
    desc: "Classic Margherita with fresh mozzarella, tomato sauce, and basil",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    calories: "620 cal",
    sizes: [
      { name: "Small", price: "£17.90" },
      { name: "Medium", price: "£27.90" },
      { name: "Large", price: "£25.90" },
    ],
    xlOption: { name: "XL Large with Sauces", price: "£30.90" },
  },
  {
    id: "pizza-5",
    title: "Vegetarian Pizza",
    rating: 4.4,
    ratingCount: 5,
    spiceLevel: 2,
    desc: "Fresh vegetables, bell peppers, mushrooms, olives with mozzarella",
    image:
      "https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: false,
    calories: "590 cal",
    sizes: [
      { name: "Small", price: "£18.90" },
      { name: "Medium", price: "£28.90" },
      { name: "Large", price: "£26.90" },
    ],
    xlOption: { name: "XL Large with Sauces", price: "£31.90" },
  },
  {
    id: "pizza-6",
    title: "Pepperoni Pizza",
    rating: 4.8,
    ratingCount: 5,
    spiceLevel: 3,
    desc: "Classic pepperoni with mozzarella cheese and tomato sauce",
    image:
      "https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    calories: "750 cal",
    sizes: [
      { name: "Small", price: "£20.90" },
      { name: "Medium", price: "£30.90" },
      { name: "Large", price: "£28.90" },
    ],
    xlOption: { name: "XL Large with Sauces", price: "£33.90" },
  },
];

export const garlicBreadItems = [
  {
    id: "garlic-1",
    title: "Classic Garlic Bread",
    desc: "Fresh baked bread with garlic butter and herbs",
    price: "£4.90",
    image:
      "https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.5,
    spiceLevel: 1,
    calories: "320 cal",
  },
  {
    id: "garlic-2",
    title: "Cheesy Garlic Bread",
    desc: "Garlic bread topped with melted mozzarella cheese",
    price: "£6.90",
    image:
      "https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.6,
    spiceLevel: 1,
    calories: "420 cal",
  },
  {
    id: "garlic-3",
    title: "Herb Garlic Bread",
    desc: "Garlic bread with mixed Italian herbs and olive oil",
    price: "£5.90",
    image:
      "https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: false,
    rating: 4.3,
    spiceLevel: 2,
    calories: "350 cal",
  },
];

export const calzoneItems = [
  {
    id: "calzone-1",
    title: "Chicken Calzone",
    desc: "Folded pizza with chicken, mozzarella, and tomato sauce",
    price: "£12.90",
    image:
      "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.4,
    spiceLevel: 2,
    calories: "650 cal",
  },
  {
    id: "calzone-2",
    title: "Vegetarian Calzone",
    desc: "Folded pizza with mixed vegetables and mozzarella",
    price: "£11.90",
    image:
      "https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: false,
    rating: 4.2,
    spiceLevel: 1,
    calories: "580 cal",
  },
];

export const kebabItems = [
  {
    id: "kebab-1",
    title: "Chicken Kebab",
    desc: "Grilled chicken with fresh salad and sauce in pita bread",
    price: "£8.90",
    image:
      "https://images.pexels.com/photos/4676410/pexels-photo-4676410.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.5,
    spiceLevel: 3,
    calories: "520 cal",
  },
  {
    id: "kebab-2",
    title: "Lamb Kebab",
    desc: "Grilled lamb with fresh salad and sauce in pita bread",
    price: "£9.90",
    image:
      "https://images.pexels.com/photos/4676410/pexels-photo-4676410.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.6,
    spiceLevel: 4,
    calories: "580 cal",
  },
  {
    id: "kebab-3",
    title: "Mixed Kebab",
    desc: "Combination of chicken and lamb with fresh salad",
    price: "£10.90",
    image:
      "https://images.pexels.com/photos/4676410/pexels-photo-4676410.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: false,
    rating: 4.4,
    spiceLevel: 4,
    calories: "620 cal",
  },
];

export const saladItems = [
  {
    id: "salad-1",
    title: "Caesar Salad",
    desc: "Fresh lettuce, croutons, parmesan, and caesar dressing",
    price: "£7.90",
    image:
      "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.3,
    calories: "250 cal",
  },
  {
    id: "salad-2",
    title: "Greek Salad",
    desc: "Mixed greens, feta cheese, olives, tomatoes, cucumber",
    price: "£8.90",
    image:
      "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: false,
    rating: 4.2,
    calories: "320 cal",
  },
];

export const coldDrinksItems = [
  {
    id: "drink-1",
    title: "Coca Cola Large",
    desc: "Classic Coca Cola served ice cold in large cup",
    price: "£2.90",
    image:
      "https://images.pexels.com/photos/4966100/pexels-photo-4966100.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.4,
    calories: "250 cal",
  },
  {
    id: "drink-2",
    title: "Fresh Lemonade",
    desc: "Freshly squeezed lemon juice with mint and ice",
    price: "£3.50",
    image:
      "https://images.pexels.com/photos/4966100/pexels-photo-4966100.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.6,
    calories: "120 cal",
  },
  {
    id: "drink-3",
    title: "Strawberry Milkshake",
    desc: "Creamy strawberry milkshake with whipped cream",
    price: "£4.80",
    image:
      "https://images.pexels.com/photos/4966100/pexels-photo-4966100.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.7,
    calories: "380 cal",
  },
  {
    id: "drink-4",
    title: "Orange Juice Fresh",
    desc: "100% pure orange juice squeezed daily",
    price: "£3.80",
    image:
      "https://images.pexels.com/photos/4966100/pexels-photo-4966100.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: false,
    rating: 4.3,
    calories: "180 cal",
  },
];

export const dessertItems = [
  {
    id: "dessert-1",
    title: "Chocolate Brownie",
    desc: "Rich chocolate brownie with vanilla ice cream",
    price: "£5.90",
    image:
      "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.7,
    calories: "420 cal",
  },
  {
    id: "dessert-2",
    title: "Tiramisu",
    desc: "Classic Italian tiramisu with coffee and mascarpone",
    price: "£6.90",
    image:
      "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.8,
    calories: "380 cal",
  },
];

export const hotDrinksItems = [
  {
    id: "hot-1",
    title: "Cappuccino",
    desc: "Rich espresso with steamed milk and foam",
    price: "£3.50",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.5,
    calories: "120 cal",
  },
  {
    id: "hot-2",
    title: "Hot Chocolate",
    desc: "Rich hot chocolate with whipped cream",
    price: "£4.20",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.6,
    calories: "280 cal",
  },
];

export const sauceItems = [
  {
    id: "sauce-1",
    title: "Garlic Mayo",
    desc: "Creamy garlic mayonnaise sauce",
    price: "£1.50",
    image:
      "https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.3,
    calories: "80 cal",
  },
  {
    id: "sauce-2",
    title: "BBQ Sauce",
    desc: "Sweet and tangy barbecue sauce",
    price: "£1.50",
    image:
      "https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=400",
    isPopular: true,
    rating: 4.4,
    calories: "60 cal",
  },
];

// Sample basket items for demo
export const defaultBasketItems = [
  {
    id: 1,
    name: '10" Margherita Pizza',
    desc: "No Mushrooms • green peppers",
    price: 27.9,
    quantity: 1,
  },
  {
    id: 2,
    name: '10" Tandoori Pizza',
    desc: "No Mushrooms • green peppers",
    price: 17.9,
    quantity: 1,
  },
  {
    id: 3,
    name: "Coke Coca Cola",
    desc: "",
    price: 4.9,
    quantity: 2,
  },
  {
    id: 4,
    name: '10" Vegetarian Pizza',
    desc: "No Mushrooms • green peppers",
    price: 27.9,
    quantity: 1,
  },
];

// Helper function to get all items by category
export const getItemsByCategory = (category) => {
  switch (category.toLowerCase()) {
    case "offers":
      return offerItems;
    case "pizzas":
      return pizzaItems;
    case "garlic bread":
      return garlicBreadItems;
    case "calzone":
      return calzoneItems;
    case "kebabs":
      return kebabItems;
    case "salads":
      return saladItems;
    case "cold drinks":
      return coldDrinksItems;
    case "desserts":
      return dessertItems;
    case "hot drinks":
      return hotDrinksItems;
    case "sauces":
      return sauceItems;
    default:
      return [];
  }
};

// Get all menu items
export const getAllMenuItems = () => {
  return [
    ...offerItems,
    ...pizzaItems,
    ...garlicBreadItems,
    ...calzoneItems,
    ...kebabItems,
    ...saladItems,
    ...coldDrinksItems,
    ...dessertItems,
    ...hotDrinksItems,
    ...sauceItems,
  ];
};

export const reviews = [
  {
    id: 1,
    name: "St Glx",
    date: "24th September, 2023",
    rating: 5,
    comment:
      "The positive aspect was undoubtedly the efficiency of the service. The pizza quality was excellent, and the delivery arrived exactly when estimated.",
    verified: true,
    helpful: 23,
  },
  {
    id: 2,
    name: "John Smith",
    date: "20th September, 2023",
    rating: 4,
    comment:
      "Great pizza experience! The tandoori pizza was amazing and the service was fast. Very satisfied with the quality and taste.",
    verified: true,
    helpful: 18,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    date: "18th September, 2023",
    rating: 5,
    comment:
      "Absolutely love this place! The pizzas are delicious and the variety is great. Clean restaurant, friendly staff, and excellent food quality. Highly recommended!",
    verified: false,
    helpful: 31,
  },
];

export const similarRestaurants = [
  {
    id: 1,
    name: "McDonald's London",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.2,
    deliveryTime: "20-25 min",
  },
  {
    id: 2,
    name: "Papa Johns",
    image:
      "https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.5,
    deliveryTime: "30-35 min",
  },
  {
    id: 3,
    name: "KFC West London",
    image:
      "https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.1,
    deliveryTime: "25-30 min",
  },
  {
    id: 4,
    name: "Texas Chicken",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.3,
    deliveryTime: "20-30 min",
  },
  {
    id: 5,
    name: "Burger King",
    image:
      "https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.0,
    deliveryTime: "25-35 min",
  },
  {
    id: 6,
    name: "Shaurma 1",
    image:
      "https://images.pexels.com/photos/1435901/pexels-photo-1435901.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.4,
    deliveryTime: "15-25 min",
  },
];
