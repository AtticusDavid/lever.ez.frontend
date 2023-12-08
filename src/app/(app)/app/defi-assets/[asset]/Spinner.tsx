import React, { PointerEventHandler, useRef, useState } from "react";
import { css } from "../../../../../../styled-system/css";
import {
  center,
  circle,
  hstack,
  vstack,
} from "../../../../../../styled-system/patterns";

function getXFromEvent<T extends HTMLDivElement>(event: React.PointerEvent<T>) {
  return event.nativeEvent.offsetX;
}

function Spinner({
  color,
  ratio,
  title,
  description,
}: {
  title?: string;
  color: string;
  description: {
    start?: React.ReactNode;
    middle?: React.ReactNode;
    end?: React.ReactNode;
  };
  ratio: number;
}) {
  const [value, setValue] = useState(ratio);

  const isDragging = useRef(false);

  const onDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging.current) return;
    const target = event.target;
    const parent = event.currentTarget;

    if (!(parent instanceof HTMLDivElement)) return;
    if (!(target instanceof HTMLDivElement)) return;

    const x =
      target.getBoundingClientRect().x -
      parent.getBoundingClientRect().x +
      getXFromEvent(event);

    const body = document.querySelector("#spinner-body");
    if (!(body instanceof HTMLDivElement)) return;
    const length = body.offsetWidth;
    setValue(x / length);
  };

  return (
    <div
      style={
        {
          "--color": color,
        } as React.CSSProperties
      }
      className={vstack({
        width: "100%",
        alignItems: "stretch",
      })}
    >
      {title ? (
        <div>
          <span
            className={center({
              display: "inline-flex",
              borderRadius: "10px",
              padding: "3px 13px",
              fontSize: "14px",
              fontWeight: "semibold",
              color: "var(--color)",
              border: "1px solid var(--color)",
            })}
          >
            {title}
          </span>
        </div>
      ) : null}

      <div>
        <div
          onPointerMove={onDrag}
          onPointerDown={(event) => {
            isDragging.current = true;
            onDrag(event);
          }}
          onPointerUp={() => {
            isDragging.current = false;
          }}
          onPointerLeave={() => {
            isDragging.current = false;
          }}
          id="spinner-body"
          className={css({
            backgroundColor: "#BEC3AF",
            borderRadius: "20px",
            height: "20px",
            padding: "5px",
            position: "relative",
          })}
        >
          <div
            style={
              {
                "--ratio": `${Math.floor(value * 100)}%`,
              } as React.CSSProperties
            }
            className={circle({
              height: "10px",
              width: "calc(var(--ratio) - 10px)",
              backgroundColor: "var(--color)",
              justifyContent: "flex-end",
            })}
          >
            <div
              className={css({
                position: "relative",
              })}
            >
              <div
                className={circle({
                  position: "absolute",
                  top: "-12.5px",
                  left: "-5px",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  width: "25px",
                  height: "25px",
                })}
              >
                <div
                  className={circle({
                    pointerEvents: "none",
                    position: "absolute",
                    backgroundColor: "var(--color)",
                    opacity: "0.7",
                    width: "15px",
                    height: "15px",
                  })}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={hstack({
          justifyContent: "space-between",
        })}
      >
        {description.start ?? <span></span>}
        {description.middle ?? <span></span>}
        {description.end ?? <span></span>}
      </div>
    </div>
  );
}

export default Spinner;
