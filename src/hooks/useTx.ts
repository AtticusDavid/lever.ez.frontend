import { sendTransaction, waitForTransaction } from "@wagmi/core";
import toast from "react-hot-toast";
import { useMutation } from "wagmi";
import useLendingStatus from "./useLendingStatus";

function useTx() {
  const { refetch } = useLendingStatus();
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
      toast.error(
        "Sorry, the transaction was unsuccessful.  Please try again."
      );
    },
    onSuccess: () => {
      toast.success(
        "Your transaction has been processed successfully. Please check your status on the dashboard."
      );
      refetch();
    },
  });
}

export default useTx;
