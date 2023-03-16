import { useSetRecoilState } from "recoil";
import { isMenuOpenAtom } from "..";
import MenuLink, { MenuLinkProps } from "../MenuLink";

const Item = (props: MenuLinkProps) => {
  const setIsMenuOpen = useSetRecoilState(isMenuOpenAtom);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div onClick={closeMenu}>
      <MenuLink
        className="flex items-center border-t border-yellow-500 py-5 px-10 cursor-pointer mr-1 text-xl font-medium text-white hover:text-yellow-500"
        {...props}
      />
    </div>
  );
};

export default Item;
