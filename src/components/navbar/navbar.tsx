import { FC } from 'react';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

export const Navbar: FC = () => {
  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  );
};
