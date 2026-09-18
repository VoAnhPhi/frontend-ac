export interface AssetItem {
  id: string;
  name: string;
  symbol?: string;
  address: string;
  image: string;
  balance?: number;
  supplyPercent: number;
  totalSupply: number;
  mintProgress: number;
}

export const wallet = {
  address: '0x4a90f6a8e0a5bdb1f149ae8471e903f6b1f65da1',
  balance: 200,
  symbol: 'ZKN',
};

export function formatAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export const tokens: AssetItem[] = [
  {
    id: 'token-1',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x4eb6970000000000000000000000000000A0fB2A',
    image: '/figma/token-1.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 100,
  },
  {
    id: 'token-2',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x3ac5820000000000000000000000000000B1cC3D',
    image: '/figma/token-2.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 0,
  },
  {
    id: 'token-3',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x7bd9130000000000000000000000000000D4eE5F',
    image: '/figma/token-3.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 0,
  },
  {
    id: 'token-4',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x8ce0240000000000000000000000000000F6aA7B',
    image: '/figma/token-4.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 100,
  },
];

export const nfts: AssetItem[] = [
  {
    id: 'nft-1',
    name: 'Tropolis Club',
    address: '0x9df1350000000000000000000000000000A8bB9C',
    image: '/figma/nft-1.png',
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 100,
  },
  {
    id: 'nft-2',
    name: 'Lil Pudgy',
    address: '0xae02460000000000000000000000000000C0dD1E',
    image: '/figma/nft-2.png',
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 100,
  },
  {
    id: 'nft-3',
    name: 'Goodman',
    address: '0xbf13570000000000000000000000000000E2fF3A',
    image: '/figma/nft-3.png',
    supplyPercent: 100,
    totalSupply: 200,
    mintProgress: 100,
  },
];
