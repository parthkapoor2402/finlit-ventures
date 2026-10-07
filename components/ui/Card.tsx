import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

type Props = HTMLAttributes<HTMLElement> & {
  muted?: boolean;
  as?: "section" | "article" | "div";
};

export function Card({ muted = false, as: Tag = "section", className, ...props }: Props) {
  const classes = [styles.card, muted ? styles.muted : "", className].filter(Boolean).join(" ");
  return <Tag className={classes} {...props} />;
}
