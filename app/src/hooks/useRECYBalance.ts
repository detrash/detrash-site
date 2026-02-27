import { useEffect, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useReadContracts } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { CRECY_TOKEN_ADDRESSES } from 'src/config';

export const useRECYBalance = () => {
  const { t } = useTranslation();
  const { address, chainId } = useAccount();
  const hasTriggeredError = useRef(false);

  const cRECYAddress = chainId ? CRECY_TOKEN_ADDRESSES[chainId] : undefined;

  const {
    isLoading,
    data: data2,
    error,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: cRECYAddress!,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        address: cRECYAddress!,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: cRECYAddress!,
        abi: erc20Abi,
        functionName: 'symbol',
      },
    ],
    query: { enabled: !!address && !!cRECYAddress },
  });

  const data = useMemo(() => {
    if (!data2) return undefined;
    return {
      decimals: data2[1],
      formatted: formatUnits(data2[0], data2[1]),
      symbol: data2[2],
      value: data2[0],
    };
  }, [data2]);

  useEffect(() => {
    if (error && !hasTriggeredError.current) {
      hasTriggeredError.current = true;
      toast.error(t('common:error_fetching_recy'), {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (data) {
      hasTriggeredError.current = false;
    }
  }, [data, error, t]);

  return { data, isLoading };
};
