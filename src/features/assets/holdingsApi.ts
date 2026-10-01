import { api } from '../../app/api';
import { toAssetItem, type AssetItem, type Product } from './assetsApi';

interface CartLine {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface Cart {
  products: CartLine[];
}

export interface MintArgs {
  userId: number;
  asset: AssetItem;
  quantity: number;
}

function supplyShare(balance: number, supply: number) {
  return supply > 0 ? Math.round((balance / supply) * 10_000) / 100 : 0;
}

function toHolding(asset: AssetItem, balance: number): AssetItem {
  return { ...asset, balance, supplyPercent: supplyShare(balance, asset.totalSupply) };
}

// Holdings are the products in the user's carts, and a cart line's quantity is the balance.
export const holdingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHoldings: build.query<AssetItem[], number>({
      async queryFn(userId, _api, _extraOptions, baseQuery) {
        // A cart line has no stock or category, and DummyJSON cannot fetch products by id list.
        // Reading both for every product (about 1 KB gzipped) runs alongside the carts request.
        const [carts, products] = await Promise.all([
          baseQuery(`/carts/user/${userId}`),
          baseQuery({ url: '/products', params: { limit: 0, select: 'stock,category' } }),
        ]);
        if (carts.error) return { error: carts.error };
        if (products.error) return { error: products.error };
        const details = new Map(
          (products.data as { products: Product[] }).products.map((product) => [
            product.id,
            product,
          ]),
        );
        // One product can sit in several carts, so its lines add up to one balance.
        const lines = new Map<number, CartLine>();
        for (const cart of (carts.data as { carts: Cart[] }).carts) {
          for (const line of cart.products) {
            const quantity = (lines.get(line.id)?.quantity ?? 0) + line.quantity;
            lines.set(line.id, { ...line, quantity });
          }
        }
        const holdings = [...lines.values()].map(({ id, title, price, thumbnail, quantity }) => {
          const product = details.get(id);
          const item = toAssetItem({
            id,
            title,
            price,
            thumbnail,
            stock: product?.stock,
            category: product?.category,
          });
          return toHolding(item, quantity);
        });
        return { data: holdings };
      },
      // Minted amounts live only in this cache, so keep it until sign-out or reload.
      keepUnusedDataFor: Infinity,
    }),
    mint: build.mutation<void, MintArgs>({
      async queryFn({ userId, asset, quantity }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: '/carts/add',
          method: 'POST',
          body: { userId, products: [{ id: asset.id, quantity }] },
        });
        if (result.error) return { error: result.error };
        // DummyJSON leaves an unknown product out of the cart instead of failing the request.
        if (!(result.data as Cart).products.some((line) => line.id === asset.id)) {
          return {
            error: {
              status: 404,
              data: {
                message: `${asset.name} does not exist on the server, so it cannot be minted.`,
              },
            },
          };
        }
        return { data: undefined };
      },
      async onQueryStarted({ userId, asset, quantity }, { dispatch, queryFulfilled }) {
        const fulfilled = await queryFulfilled.catch(() => null);
        if (!fulfilled) return;
        // Load the server's holdings first, so the minted amount adds to them instead of replacing them.
        await dispatch(holdingsApi.endpoints.getHoldings.initiate(userId, { subscribe: false }));
        dispatch(
          holdingsApi.util.updateQueryData('getHoldings', userId, (holdings) => {
            const index = holdings.findIndex((held) => held.id === asset.id);
            if (index === -1) {
              holdings.unshift(toHolding(asset, quantity));
            } else {
              const held = holdings[index];
              holdings[index] = toHolding(held, (held.balance ?? 0) + quantity);
            }
          }),
        );
      },
    }),
  }),
});

export const { useGetHoldingsQuery, useMintMutation } = holdingsApi;
