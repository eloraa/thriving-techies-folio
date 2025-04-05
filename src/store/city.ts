import { CityCanvas } from '@/lib/canvas';
import { create } from 'zustand';

interface City {
  city: CityCanvas | null;
  setCity: (city: CityCanvas) => void;
}

export const useCity = create<City>(set => ({
  city: null,
  setCity: city =>
    set({
      city,
    }),
}));
