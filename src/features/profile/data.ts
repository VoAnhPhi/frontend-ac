// Values from the design: DummyJSON has no wallet balance, and the address is only a fallback.
export const wallet = {
  address: '0x4a90f6a8e0a5bdb1f149ae8471e903f6b1f65da1',
  balance: 200,
  symbol: 'ZKN',
};

export function formatAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
