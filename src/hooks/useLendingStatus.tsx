import { LendingStatusResponse } from "@/app/api/lending-status/route";
import { useQuery } from "wagmi";

function useLendingStatus() {
  return useQuery(["lending-status"], () =>
    fetch("/api/lending-status").then(
      (r) => r.json() as Promise<LendingStatusResponse>
    )
  );
}

export default useLendingStatus;
