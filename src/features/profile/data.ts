export interface AssetItem {
  id: string;
  name: string;
  symbol?: string;
  address: string;
  image: string;
  balance?: number;
  supplyPercent: number;
  totalSupply: number;
}

export const tokens: AssetItem[] = [
  {
    id: 'token-1',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x4eb697...A0fB2A',
    image: '/figma/token-1.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
  },
  {
    id: 'token-2',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x4eb697...A0fB2A',
    image: '/figma/token-2.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
  },
  {
    id: 'token-3',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x4eb697...A0fB2A',
    image: '/figma/token-3.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
  },
  {
    id: 'token-4',
    name: 'Goodman',
    symbol: 'GM',
    address: '0x4eb697...A0fB2A',
    image: '/figma/token-4.png',
    balance: 200,
    supplyPercent: 100,
    totalSupply: 200,
  },
];

export const nfts: AssetItem[] = [
  {
    id: 'nft-1',
    name: 'Tropolis Club',
    address: '0x4eb697...A0fB2A',
    image: '/figma/nft-1.png',
    supplyPercent: 100,
    totalSupply: 200,
  },
  {
    id: 'nft-2',
    name: 'Lil Pudgy',
    address: '0x4eb697...A0fB2A',
    image: '/figma/nft-2.png',
    supplyPercent: 100,
    totalSupply: 200,
  },
  {
    id: 'nft-3',
    name: 'Goodman',
    address: '0x4eb697...A0fB2A',
    image: '/figma/nft-3.png',
    supplyPercent: 100,
    totalSupply: 200,
  },
];
