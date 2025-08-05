import React from 'react';

export function Header({ Nav, Logo }: { Nav: React.FC; Logo: React.FC }) {
  return (
    <header className="header">
      <div className="header__logo">
        <Logo />
      </div>
      <div className="header__nav">
        <nav>
          <Nav />
        </nav>
      </div>
    </header>
  );
}
