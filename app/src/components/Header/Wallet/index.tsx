import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';
import { Wallet as WalletIcon } from 'phosphor-react';
import { Fragment, useMemo } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const METAMASK_ID = 'METAMASK';

type WalletProps = {
  title: string;
};

const Wallet: React.FC<WalletProps> = ({ title }) => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { open, close } = useWeb3Modal();

  const formattedAddress = `${address?.substring(0, 12)}...`;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={classNames(
            'inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-colors duration-150',
            {
              'bg-black bg-opacity-20': !isConnected,
              'bg-teal-600': isConnected,
            },
          )}
          onClick={() => open()}
        >
          {isConnected ? <p>{formattedAddress}</p> : <p>{title}</p>}
          <WalletIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
    </Menu>
  );
};

export default Wallet;
