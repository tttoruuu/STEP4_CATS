import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NeoNavBarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[];
  activeId?: string;
  onItemClick?: (item: NavItem) => void;
  logo?: React.ReactNode;
  brandName?: string;
}

const NeoNavBar = React.forwardRef<HTMLElement, NeoNavBarProps>(
  ({ 
    className, 
    items = [], 
    activeId,
    onItemClick,
    logo,
    brandName,
    ...props 
  }, ref) => {
    const [currentActive, setCurrentActive] = React.useState(activeId);

    const handleItemClick = (item: NavItem) => {
      setCurrentActive(item.id);
      if (onItemClick) {
        onItemClick(item);
      }
      if (item.onClick) {
        item.onClick();
      }
    };

    return (
      <header ref={ref} className={cn('header', className)} {...props}>
        <div className="header-content">
          {(logo || brandName) && (
            <div className="logo-section">
              {logo && <div className="cat-container">{logo}</div>}
              {brandName && <div className="brand-name">{brandName}</div>}
            </div>
          )}
          
          {items.length > 0 && (
            <nav className="nav-bar">
              {items.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    'nav-btn',
                    currentActive === item.id && 'active'
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>
    );
  }
);

NeoNavBar.displayName = 'NeoNavBar';

export { NeoNavBar };