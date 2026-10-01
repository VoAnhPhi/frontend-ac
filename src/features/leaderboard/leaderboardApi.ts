import { api } from '../../app/api';
import { productImage, type Product } from '../assets/assetsApi';

export const leaderboardSize = 50;

interface RankedProduct extends Product {
  brand?: string;
  sku?: string;
}

export interface LeaderboardRow {
  rank: number;
  token: string;
  sku?: string;
  icon: string;
  creator?: string;
  marketCap?: number;
  price?: number;
}

export const leaderboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    // A product's rating is the only score DummyJSON has, so it decides the rank.
    getLeaderboard: build.query<LeaderboardRow[], void>({
      query: () => ({
        url: '/products',
        params: {
          sortBy: 'rating',
          order: 'desc',
          limit: leaderboardSize,
          select: 'title,brand,sku,price,stock,thumbnail',
        },
      }),
      transformResponse: ({ products }: { products: RankedProduct[] }) =>
        products.map((product, index) => ({
          rank: index + 1,
          token: product.title,
          sku: product.sku,
          icon: productImage(product),
          creator: product.brand,
          price: product.price,
          marketCap:
            product.price !== undefined && product.stock !== undefined
              ? product.price * product.stock
              : undefined,
        })),
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
