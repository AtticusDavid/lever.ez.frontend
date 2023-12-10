import { produce } from "immer";
import { css } from "../../../../../../../styled-system/css";
import {
  center,
  hstack,
  vstack,
} from "../../../../../../../styled-system/patterns";
import { useState } from "react";
import Image from "next/image";
import { networks } from "@/hooks/useChainsClose";

function ChooseChain() {
  const [indiceSet, updateIndiceSet] = useState(new Set<number>());

  return null;
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
        {networks.map((chainName, chainIndex) => {
          const isActive = indiceSet.has(chainIndex);
          return (
            <div
              key={chainName}
              onClick={() => {
                updateIndiceSet(
                  produce((draft) => {
                    if (isActive) {
                      draft.delete(chainIndex);
                      return;
                    }
                    draft.add(chainIndex);
                  })
                );
              }}
              style={
                {
                  "--bg": isActive ? "#B8FF04" : "#53544E",
                  "--color": isActive ? "#000000" : "#FFFFFF",
                  "--amount-color": isActive ? "#393939" : "#BEC3AF",
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
                    isActive
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
                {chainName}
              </span>
              <span
                className={css({
                  color: "var(--amount-color)",
                  fontSize: "16px",
                  fontWeight: "normal",
                })}
              >
                20TH
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChooseChain;
