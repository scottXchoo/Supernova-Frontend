import { AnchorHTMLAttributes } from "react";
import Link from "next/link";

export type MenuLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const MenuLink = ({ href, ...props }: MenuLinkProps) => {
  return (
    <Link href={href || ""}>
      <a {...props} />
    </Link>
  );
};

export default MenuLink;
