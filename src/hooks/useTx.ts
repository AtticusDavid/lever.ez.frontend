import { leveragerAddress } from "@/hardhat/constants";
import { useToast } from "@chakra-ui/react";
import { sendTransaction, waitForTransaction } from "@wagmi/core";
import { Network } from "ethers";
import { useMutation } from "wagmi";

function useTx() {
  const toast = useToast();
  return useMutation({
    mutationFn: ({
      txData,
      to,
    }: {
      txData: `0x${string}`;
      to: `0x${string}`;
    }) => {
      return sendTransaction({
        data: txData,
        to,
      }).then((res) => {
        return waitForTransaction({
          hash: res.hash,
        });
      });
    },
    onError: () => {
      toast({
        status: "error",
        title: "Transaction Failed",
        description:
          "Sorry, the transaction was unsuccessful.  Please try again.",
      });
    },
    onSuccess: () => {
      toast({
        status: "success",
        title: "Transaction Successful",
        description:
          "Your transaction has been processed successfully. Please check your status on the dashboard.",
      });
    },
  });
}

export default useTx;
