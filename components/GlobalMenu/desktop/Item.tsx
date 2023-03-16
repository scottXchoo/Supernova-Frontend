import MenuLink, { MenuLinkProps } from "../MenuLink";

const Item = ({ children, ...props }: MenuLinkProps) => {
  return (
    <li className="mr-8">
      <MenuLink href={"/stake"} {...props}>
        <p className="text-white font-medium hover:text-yellow-500 cursor-pointer">
          {children}
        </p>
      </MenuLink>
    </li>
  );
};

export default Item;
