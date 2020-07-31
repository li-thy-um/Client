import { Avatar } from '@web/components/Avatar';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { useLocation } from 'react-router';
import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

const NavbarAvtar = styled(Avatar).attrs({
  size: 50,
  style: {
    cursor: 'pointer',
  },
})`
  transition: border-radius 0.2s ease-in-out;

  &:hover,
  &.active {
    border-radius: 25%;
  }
`;
NavbarAvtar.displayName = 'NavbarAvtar';

interface NavbarLinkProps {
  name: string;
  src?: string;
  to: string;
}
export const NavbarLink: React.FC<NavbarLinkProps> = TMemo((props) => {
  const { name, src, to } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Tooltip title={name} placement="right" overlayStyle={{ fontSize: 16 }}>
      <Link to={to}>
        <NavbarAvtar
          className={isActive ? 'active' : ''}
          src={src}
          name={name}
        />
      </Link>
    </Tooltip>
  );
});
NavbarLink.displayName = 'NavbarLink';