import { produce } from "immer";
import { css } from "../../../../../../../styled-system/css";
import {
  center,
  hstack,
  vstack,
} from "../../../../../../../styled-system/patterns";
import Image from "next/image";
import useChainsClose, { networks } from "@/hooks/useChainsClose";
import { TokenKey } from "../../assets";
import { prettify } from "@/utils";
import { Network, mapChainName } from "@/hooks/useLendingStatus";
import { useNetwork } from "wagmi";

const ChooseChain = ({
  token,
  networkSet,
  updateNetworkSet,
}: {
  token: TokenKey;
  networkSet: Set<Network>;
  updateNetworkSet: React.Dispatch<React.SetStateAction<Set<Network>>>;
}) => {
  const { data } = useChainsClose({ token });
  const { chain } = useNetwork();

  return (
    <div
      className={css({
        width: "100%",
      })}
    >
      <div
        className={center({
          width: "100%",
          textAlign: "center",
          fontSize: "23px",
          fontWeight: "semibold",
          marginBottom: "10px",
        })}
      >
        If you want to close on <br></br>different chain, select chain.
      </div>
      <div
        className={hstack({
          gap: "12px",
        })}
      >
        {(data ?? [])
          // .filter((item) => !item.needApprove)
          .map((item) => {
            const isActive = networkSet.has(item.networkName);
            const isDisable =
              item.needApprove ||
              mapChainName(chain?.name) === item.networkName;
            // const isDisable = true;
            return (
              <div
                key={item.networkName}
                onClick={() => {
                  if (isDisable) return;
                  updateNetworkSet(
                    produce((draft) => {
                      if (isActive) {
                        draft.delete(item.networkName);
                        return;
                      }
                      draft.add(item.networkName);
                    })
                  );
                }}
                style={
                  {
                    "--bg": isDisable
                      ? "#BEC3AF"
                      : isActive
                      ? "#B8FF04"
                      : "#53544E",
                    "--color": isActive || isDisable ? "#000000" : "#FFFFFF",
                    "--amount-color":
                      isActive || isDisable ? "#393939" : "#BEC3AF",
                  } as React.CSSProperties
                }
                className={vstack({
                  flexGrow: "1",
                  gap: "4px",
                  backgroundColor: "var(--bg)",
                  borderRadius: "10px",
                  padding: "10px",
                  width: "160px",
                })}
              >
                <div
                  className={center({
                    position: "relative",
                  })}
                >
                  <Image
                    src={
                      isActive || isDisable
                        ? "/icon/black-circle.svg"
                        : "/icon/gray-circle.svg"
                    }
                    width={25}
                    height={25}
                    alt=""
                  ></Image>
                  {isActive ? (
                    <Image
                      className={css({
                        position: "absolute",
                      })}
                      src="/icon/black-checked.svg"
                      width={12}
                      height={12}
                      alt=""
                    ></Image>
                  ) : null}
                </div>
                <span
                  className={css({
                    // fontSize: "24px",
                    fontSize: "16px",
                    color: "var(--color)",
                  })}
                >
                  {item.networkName}
                </span>
                <div
                  className={center({
                    color: "var(--amount-color)",
                    fontSize: "16px",
                    fontWeight: "normal",
                    textAlign: "center",
                  })}
                >
                  LTV: {prettify(item.ltv.toString())}% <br></br>
                  {prettify(
                    (item.borrowAmount + item.supplyAmount).toString()
                  )}{" "}
                  {token}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChooseChain;
