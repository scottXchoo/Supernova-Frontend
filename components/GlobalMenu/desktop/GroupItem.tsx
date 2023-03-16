import { Menu as DropDown } from "@headlessui/react";
import MenuLink, { MenuLinkProps } from "../MenuLink";

const GroupItem = ({ children, ...props }: MenuLinkProps) => {
  return (
    <DropDown.Item key={0}>
      <MenuLink {...props}>
        <div className="cursor-pointer block whitespace-nowrap pr-7 text-black font-medium pl-3 py-1.5 rounded-md text-sm bg-white hover:bg-yellow-500">
          {children}
        </div>
      </MenuLink>
    </DropDown.Item>
  );
};

export default GroupItem;
