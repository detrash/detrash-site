import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { QueryClient } from '@tanstack/react-query';

import { alfajoresChain, celoChain } from 'src/config';

// 0. Setup queryClient
export const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

if (!projectId) throw new Error('NEXT_PUBLIC_WALLETCONNECT_ID is not defined');

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [celoChain, alfajoresChain] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  enableEmail: true,
});
