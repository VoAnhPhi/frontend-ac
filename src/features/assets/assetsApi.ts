import { api } from '../../app/api';
import type { AppDispatch, RootState } from '../../app/store';

export type AssetType = 'token' | 'nft';

export interface AssetItem {
  id: number;
  type: AssetType;
  name: string;
  price?: number;
  image: string;
  balance?: number;
  supplyPercent: number;
  totalSupply: number;
  mintProgress: number;
}

export const assetsPerPage = 10;

// NFT collections are the products of one category. They still appear in the token list,
// because DummyJSON cannot exclude a category from /products.
export const nftCategory = 'mens-watches';

// Fields the slice shows but a DummyJSON product does not have keep their slice defaults.
const sliceDefaults = { supply: 200, supplyPercent: 100, mintProgress: 0 };

export interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  thumbnail?: string;
}

export interface AssetPage {
  items: AssetItem[];
  total: number;
}

interface AssetPageArgs {
  type: AssetType;
  page: number;
}

export interface AssetFields {
  name: string;
  supply: number;
  description: string;
}

export interface AssetDetails extends AssetFields {
  id: number;
}

export function assetType(product: Pick<Product, 'category'>): AssetType {
  return product.category === nftCategory ? 'nft' : 'token';
}

export function productImage({ id, thumbnail }: Pick<Product, 'id' | 'thumbnail'>) {
  return thumbnail || `/figma/token-${(id % 4) + 1}.png`;
}

export function toAssetItem(product: Product): AssetItem {
  const supply = product.stock ?? sliceDefaults.supply;
  return {
    id: product.id,
    type: assetType(product),
    name: product.title,
    price: product.price,
    image: productImage(product),
    balance: supply,
    totalSupply: supply,
    supplyPercent: sliceDefaults.supplyPercent,
    mintProgress: sliceDefaults.mintProgress,
  };
}

function toProductBody({ name, supply, description }: AssetFields) {
  return { title: name, stock: supply, description };
}

// /products lists every product, so the token list holds the NFTs as well.
function listIncludes(type: AssetType, asset: AssetItem) {
  return type === 'token' || asset.type === 'nft';
}

// DummyJSON simulates writes without storing them, so a refetch would undo every change.
// Mutations apply the server response to the cached pages instead of invalidating them.
function updateCachedPages(
  dispatch: AppDispatch,
  getState: () => unknown,
  recipe: (page: AssetPage, args: AssetPageArgs) => void,
) {
  const state = getState() as RootState;
  for (const args of assetsApi.util.selectCachedArgsForQuery(state, 'getAssets')) {
    dispatch(assetsApi.util.updateQueryData('getAssets', args, (page) => recipe(page, args)));
  }
}

export const assetsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAssets: build.query<AssetPage, AssetPageArgs>({
      query: ({ type, page }) => ({
        url: type === 'nft' ? `/products/category/${nftCategory}` : '/products',
        params: {
          limit: assetsPerPage,
          skip: (page - 1) * assetsPerPage,
          select: 'title,category,price,stock,thumbnail',
        },
      }),
      transformResponse: ({ products, total }: { products: Product[]; total: number }) => ({
        items: products.map(toAssetItem),
        total,
      }),
      // The cache is the only place simulated writes live, so keep it until sign-out or reload.
      keepUnusedDataFor: Infinity,
    }),
    getAsset: build.query<AssetDetails, number>({
      query: (id) => `/products/${id}`,
      transformResponse: ({ id, title, stock, description }: Product) => ({
        id,
        name: title,
        supply: stock ?? sliceDefaults.supply,
        description: description ?? '',
      }),
      keepUnusedDataFor: Infinity,
    }),
    addAsset: build.mutation<AssetItem, { type: AssetType; fields: AssetFields }>({
      query: ({ type, fields }) => ({
        url: '/products/add',
        method: 'POST',
        body: {
          ...toProductBody(fields),
          ...(type === 'nft' && { category: nftCategory }),
        },
      }),
      transformResponse: toAssetItem,
      async onQueryStarted({ type }, { dispatch, getState, queryFulfilled }) {
        // A failed request leaves the cache alone; the form shows the error.
        const fulfilled = await queryFulfilled.catch(() => null);
        if (!fulfilled) return;
        const asset = fulfilled.data;
        // The list opens on page 1 next, so make sure that page is cached before adding to it.
        await dispatch(
          assetsApi.endpoints.getAssets.initiate({ type, page: 1 }, { subscribe: false }),
        );
        updateCachedPages(dispatch, getState, (page, args) => {
          if (!listIncludes(args.type, asset)) return;
          if (args.type === type && args.page === 1) page.items.unshift(asset);
          page.total += 1;
        });
      },
    }),
    updateAsset: build.mutation<AssetItem, AssetDetails>({
      query: ({ id, ...fields }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: toProductBody(fields),
      }),
      transformResponse: toAssetItem,
      async onQueryStarted(details, { dispatch, getState, queryFulfilled }) {
        const fulfilled = await queryFulfilled.catch(() => null);
        if (!fulfilled) return;
        const asset = fulfilled.data;
        updateCachedPages(dispatch, getState, (page) => {
          const index = page.items.findIndex((item) => item.id === asset.id);
          if (index !== -1) page.items[index] = asset;
        });
        dispatch(assetsApi.util.upsertQueryData('getAsset', details.id, details));
      },
    }),
    deleteAsset: build.mutation<void, AssetItem>({
      query: ({ id }) => ({ url: `/products/${id}`, method: 'DELETE' }),
      transformResponse: () => undefined,
      async onQueryStarted(asset, { dispatch, getState, queryFulfilled }) {
        const fulfilled = await queryFulfilled.catch(() => null);
        if (!fulfilled) return;
        updateCachedPages(dispatch, getState, (page, args) => {
          if (!listIncludes(args.type, asset)) return;
          page.items = page.items.filter((item) => item.id !== asset.id);
          page.total -= 1;
        });
      },
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetQuery,
  useAddAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetsApi;
