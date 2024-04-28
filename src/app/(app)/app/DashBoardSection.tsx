import { PropsWithChildren } from "react";
import { css } from "../../../../styled-system/css";

type DashboardSectionProps = PropsWithChildren<{
  title: string;
}>;

function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <section
      className={css({
        display: "inline-flex",
        flexDirection: "column",
        borderRadius: "10px",
        backgroundColor: "#171814",
        maxWidth: "926px",
        padding: "18px 16px",
      })}
    >
      <div
        className={css({
          fontSize: "24px",
          fontWeight: "semibold",
          color: "white",
          marginBottom: "18px",
        })}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

export default DashboardSection;
