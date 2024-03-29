import { Chain, goerli } from 'wagmi/chains';
import type { Address } from 'abitype';

export const celoChain: Chain = {
  id: 42220,
  name: 'Celo',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: { http: ['https://forno.celo.org/'] },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://celoscan.io/' },
  },
  testnet: false,
};

export const alfajoresChain: Chain = {
  id: 44787,
  name: 'Alfajores Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'A-CELO',
    symbol: 'A-CELO',
  },
  rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: 'https://alfajores.celoscan.io/',
    },
  },
  testnet: true,
};

export const CRECY_TOKEN_ADDRESSES: { [id: number]: Address } = {
  [celoChain.id]: '0x34C11A932853Ae24E845Ad4B633E3cEf91afE583', // TODO: Update address
  [alfajoresChain.id]: '0xf64C1a07144B22cdD109d5b82004aEd4759114c4',
};

export const TIME_LOCK_ADDRESSES: { [id: number]: Address } = {
  [celoChain.id]: '0x34C11A932853Ae24E845Ad4B633E3cEf91afE583', // TODO: Update address
  [alfajoresChain.id]: '0x03eB6a8d135e1d27214116Cf7c794f00aba9dd92',
};
