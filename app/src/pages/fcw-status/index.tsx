import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

import DashboardHeader from 'src/components/Header';
import { ProfileType } from 'src/graphql/generated/graphql';
import { getPageTranslations } from 'src/utils/userSSGMethods';
import { useRECYBalance } from 'src/hooks/useRECYBalance';
import { useLockRECY } from 'src/hooks/useLockRECY';
import { parseUnits } from 'viem';
import { toast } from 'react-toastify';

const AppHome: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lockAmount, setLockAmount] = useState('');
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { data: cRECYBalance } = useRECYBalance();
  const {
    hasEnoughBalance,
    isLoading,
    shouldApprove,
    approve,
    lock,
    isApproving,
    isApproved,
    isLocking,
    isLocked,
  } = useLockRECY({
    amount: parseUnits(lockAmount, cRECYBalance?.decimals || 18),
    balance: cRECYBalance?.value,
  });

  const handleLock = useCallback(() => {
    if (shouldApprove) {
      approve();
    } else {
      lock();
    }
  }, [shouldApprove, lock, approve]);

  useEffect(() => {
    if (isApproving) {
      toast.info('Approving....');
    }
  }, [isApproving]);

  useEffect(() => {
    if (isApproved) {
      toast.success('Approved');
    }
  }, [isApproved]);

  useEffect(() => {
    if (isLocking) {
      toast.info('Locking....');
    }
  }, [isLocking]);

  useEffect(() => {
    if (isLocked) {
      toast.success('Locked');
    }
  }, [isLocked]);

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
              {cRECYBalance && (
                <p>
                  {`Your balance: ${cRECYBalance.formatted} ${cRECYBalance.symbol}`}
                </p>
              )}
              <input
                type="number"
                className="w-full max-w-xs"
                placeholder="Amount"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
              />
              {hasEnoughBalance ? (
                <button
                  className="btn btn-primary text-white w-full sm:w-auto text-center max-w-xs"
                  onClick={() => handleLock()}
                  disabled={isLoading}
                >
                  {shouldApprove ? 'Approve' : 'Lock'}
                </button>
              ) : (
                <>You don&apos;t have enough balance</>
              )}
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
