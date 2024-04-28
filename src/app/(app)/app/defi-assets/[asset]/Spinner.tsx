import React, { PointerEventHandler, useEffect, useRef, useState } from "react";
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
  markers,
  description,
  minimumRatio,
  onChange,
}: {
  title?: string;
  color: string;
  description: {
    start?: React.ReactNode;
    middle?: React.ReactNode;
    end?: React.ReactNode;
  };
  markers?: {
    id: string;
    color?: string;
    ratio: number;
  }[];
  ratio: number;
  minimumRatio?: number;
  onChange?: (value: number) => void;
}) {
  const isReadOnly = !onChange;
  const isDragging = useRef(false);

  useEffect(() => {
    if (minimumRatio && onChange) {
      if (minimumRatio > ratio) {
        onChange(minimumRatio);
      }
    }
  }, [minimumRatio, ratio, onChange]);

  const onDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    if (isReadOnly) return;
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
    const value = x / length > 0.99 ? 1 : x / length;
    if (minimumRatio) {
      onChange(Math.min(Math.max(minimumRatio, value), 1));
      return;
    }
    onChange(Math.min(1, value));
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
          {/* <div
            className={hstack({
              marginLeft: "10px",
              display: "inline-flex",
              fontSize: "12px",
            })}
          >
            <span>min</span>
            <span>max</span>
          </div> */}
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
                "--ratio": `${Math.floor(ratio * 100)}%`,
              } as React.CSSProperties
            }
            className={circle({
              position: "relative",
              height: "10px",
              width: "calc(var(--ratio) - 7.5px)",
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
          {}
          {markers?.map((marker) => {
            return (
              <div
                key={marker.id}
                style={
                  {
                    "--marker-color": marker.color ?? "rgba(0,0,0,0.7)",
                    "--minimum-ratio": `${Math.floor(marker.ratio * 100)}%`,
                  } as React.CSSProperties
                }
                className={css({
                  pointerEvents: "none",
                  position: "absolute",
                  left: "0px",
                  top: "0px",
                  width: "calc(100% - 20px)",
                  height: "20px",
                  padding: "0 10px",
                })}
              >
                <div
                  className={circle({
                    top: "0px",
                    left: "calc(var(--minimum-ratio))",
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "var(--marker-color)",
                  })}
                ></div>
              </div>
            );
          })}
          {minimumRatio !== undefined ? (
            <div
              style={
                {
                  "--minimum-ratio": `${Math.floor(
                    (minimumRatio ?? 0) * 100
                  )}%`,
                } as React.CSSProperties
              }
              className={css({
                pointerEvents: "none",
                position: "absolute",
                left: "0px",
                top: "0px",
                width: "calc(100% - 20px)",
                height: "20px",
                padding: "0 10px",
              })}
            >
              <div
                className={circle({
                  top: "0px",
                  left: "calc(var(--minimum-ratio))",
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgba(0,0,0,0.7)",
                })}
              ></div>
            </div>
          ) : null}
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
