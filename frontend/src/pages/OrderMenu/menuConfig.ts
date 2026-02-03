/**
 * Display order and labels for menu categories.
 * Order: Food (Breakfast, Lunch, Supper) → Soft drinks/Juices/Energy/Sodas → Water → Fast foods → Alcohol
 */

export type MenuType = 'food' | 'softdrinks' | 'alcohol' | 'fast-foods';

export const CATEGORY_DISPLAY_ORDER: Record<MenuType, string[]> = {
  food: ['Breakfast', 'Lunch', 'Supper'],
  softdrinks: ['Soda', 'Juices', 'Energy Drinks', 'Energydrink', 'Water'],
  alcohol: ['Beers', 'Wines', 'Whiskeys'],
  'fast-foods': ['Burgers', 'Pizza', 'Taccos', 'Sand Wiches', 'Sand_Wich', 'Chips'],
};

/** Friendly names for API category values */
export const CATEGORY_LABELS: Record<string, string> = {
  Energydrink: 'Energy Drinks',
  'Sand_Wich': 'Sandwiches',
  'Sand Wiches': 'Sandwiches',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
