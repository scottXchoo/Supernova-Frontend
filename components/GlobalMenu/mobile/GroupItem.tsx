import { useSetRecoilState } from "recoil";
import { isMenuOpenAtom } from "..";
import MenuLink, { MenuLinkProps } from "../MenuLink";

const GroupItem = (props: MenuLinkProps) => {
  const setIsMenuOpen = useSetRecoilState(isMenuOpenAtom);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div onClick={closeMenu}>
      <MenuLink
        className="flex items-center text-black text-sm font-medium border-b border-yellow-500 py-4 px-10 bg-white hover:bg-yellow-500"
        {...props}
      />
    </div>
  );
};

export default GroupItem;
