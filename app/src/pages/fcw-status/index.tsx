import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

import DashboardHeader from 'src/components/Header';
import { ProfileType } from 'src/graphql/generated/graphql';
import { getPageTranslations } from 'src/utils/userSSGMethods';

const AppHome: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <main className="flex flex-col min-h-screen">
      <DashboardHeader
        userProfileType={ProfileType.WasteGenerator}
        isAdmin={isAdmin}
      />
      <section className="flex-grow py-6 sm:py-12 bg-gray-100">
        <div className="max-w-screen-lg flex flex-col items-center justify-center gap-2 mx-auto px-2 sm:px-6 lg:px-8">
          <div className="w-48 h-48 bg-gray-600 rounded-xl">company logo</div>
          {isConnected ? (
            <>
              <p className="text-lg">
                Please enter the amount of cRECY you want to lock.
              </p>
              <input
                type="number"
                className="w-full max-w-xs"
                placeholder="Amount"
              />
              <button
                className="btn btn-primary text-white w-full sm:w-auto text-center max-w-xs"
                onClick={() => open()}
              >
                Lock
              </button>
            </>
          ) : (
            <>
              <p className="text-lg">
                Connect your wallet to unlock your FCW status NFT.
              </p>
              <button
                className="btn btn-primary text-white w-full sm:w-auto text-center max-w-xs"
                onClick={() => open()}
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export const getStaticProps = getPageTranslations(['common', 'dashboard']);

export default AppHome;
