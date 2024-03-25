import { useCallback, useMemo, useState } from 'react';
import { erc20Abi } from 'viem';
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import { timelockAbi } from 'src/abis';
import { CRECY_TOKEN_ADDRESSES, TIME_LOCK_ADDRESSES } from 'src/config';

export const useLockRECY = ({ amount }: { amount: bigint }) => {
  const { address, chainId } = useAccount();
  const cRECYAddress = chainId ? CRECY_TOKEN_ADDRESSES[chainId] : undefined;
  const timelockAddress = chainId ? TIME_LOCK_ADDRESSES[chainId] : undefined;
  const [isApproving, setIsApproving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    abi: erc20Abi,
    address: cRECYAddress,
    functionName: 'allowance',
    args: [address!, timelockAddress!],
    query: { enabled: !!address && !!cRECYAddress && !!timelockAddress },
  });
  const { writeContractAsync } = useWriteContract();

  const shouldApprove = useMemo(() => {
    if (allowance === undefined || isLoadingAllowance) return undefined;
    return allowance < amount;
  }, [isLoadingAllowance, allowance, amount]);

  const { data: approveSimulation, isLoading: isApproveSimulationLoading } =
    useSimulateContract({
      abi: erc20Abi,
      address: cRECYAddress!,
      functionName: 'approve',
      args: [timelockAddress!, amount],
      query: {
        enabled: !!cRECYAddress && !!timelockAddress && shouldApprove,
      },
    });

  const approve = useCallback(async () => {
    if (isApproveSimulationLoading || !approveSimulation) return;
    setIsApproving(true);
    await writeContractAsync(approveSimulation.request);
    setIsApproving(false);
    refetchAllowance();
  }, [
    isApproveSimulationLoading,
    approveSimulation,
    writeContractAsync,
    refetchAllowance,
  ]);

  const { data: lockSimulation, isLoading: isLockSimulationLoading } =
    useSimulateContract({
      abi: timelockAbi,
      address: cRECYAddress!,
      functionName: 'lock',
      args: [amount],
      query: {
        enabled: !!cRECYAddress && !!timelockAddress && !shouldApprove,
      },
    });

  const lock = useCallback(async () => {
    if (isLockSimulationLoading || !lockSimulation) return;
    setIsLocking(true);
    await writeContractAsync(lockSimulation.request);
    setIsLocking(false);
  }, [isLockSimulationLoading, lockSimulation, writeContractAsync]);

  return {
    isLoadingAllowance,
    shouldApprove,
    isApproving,
    isLocking,
    approve,
    lock,
  };
};
