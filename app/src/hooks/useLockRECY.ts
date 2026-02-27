import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi } from 'viem';
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { timelockAbi } from 'src/abis';
import { CRECY_TOKEN_ADDRESSES, TIME_LOCK_ADDRESSES } from 'src/config';

export const useLockRECY = ({
  amount,
  balance,
}: {
  amount: bigint;
  balance?: bigint;
}) => {
  const { address, chainId } = useAccount();
  const cRECYAddress = chainId ? CRECY_TOKEN_ADDRESSES[chainId] : undefined;
  const timelockAddress = chainId ? TIME_LOCK_ADDRESSES[chainId] : undefined;
  const [approveTx, setApproveTx] = useState<Address>('0x');
  const [lockTx, setLockTx] = useState<Address>('0x');

  const hasEnoughBalance = useMemo(() => {
    if (balance === undefined) return undefined;
    return balance >= amount;
  }, [amount, balance]);

  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    abi: erc20Abi,
    address: cRECYAddress,
    functionName: 'allowance',
    args: [address!, timelockAddress!],
    query: {
      enabled:
        !!address && !!cRECYAddress && !!timelockAddress && hasEnoughBalance,
    },
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

  const { isLoading: isApproving, isSuccess: isApproved } =
    useWaitForTransactionReceipt({
      hash: approveTx,
      query: { enabled: approveTx !== '0x' },
    });

  useEffect(() => {
    refetchAllowance();
  }, [isApproved, refetchAllowance]);

  const approve = useCallback(async () => {
    if (isApproveSimulationLoading || !approveSimulation) return;

    const tx = await writeContractAsync(approveSimulation.request);
    setApproveTx(tx);
  }, [isApproveSimulationLoading, approveSimulation, writeContractAsync]);

  const { data: lockSimulation, isLoading: isLockSimulationLoading } =
    useSimulateContract({
      abi: timelockAbi,
      address: timelockAddress!,
      functionName: 'lock',
      args: [amount],
      query: {
        enabled: !!timelockAddress && !shouldApprove && hasEnoughBalance,
      },
    });

  const { isLoading: isLocking, isSuccess: isLocked } =
    useWaitForTransactionReceipt({
      hash: lockTx,
      query: { enabled: lockTx !== '0x' },
    });

  const lock = useCallback(async () => {
    if (isLockSimulationLoading || !lockSimulation) return;
    const tx = await writeContractAsync(lockSimulation.request);
    setLockTx(tx);
  }, [isLockSimulationLoading, lockSimulation, writeContractAsync]);

  const isLoading =
    isLoadingAllowance || isApproveSimulationLoading || isLockSimulationLoading;

  return {
    hasEnoughBalance,
    isLoading,
    shouldApprove,
    isApproving,
    isApproved,
    isLocking,
    isLocked,
    approve,
    lock,
  };
};
