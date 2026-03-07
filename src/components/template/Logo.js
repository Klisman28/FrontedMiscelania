import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { APP_NAME } from 'constants/app.constant';
import { useSelector } from 'react-redux';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

const Logo = props => {
  const {
    type,
    mode,
    gutter,
    className,
    imgClass,
    style,
    logoWidth,
    logoHeight
  } = props;

  const companyLogoUrl = useSelector((state) => state.base.company.logoSignedUrl);
  const companyName = useSelector((state) => state.base.company.companyName);

  const hasLogo = !!companyLogoUrl;
  const displayName = companyName || APP_NAME;
  const isCollapsed = type === 'streamline';
  const isDark = mode === 'dark';

  // Get initials for fallback avatar
  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={classNames('logo', className, gutter)}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: isCollapsed ? 0 : '12px',
        height: logoHeight,
        width: logoWidth,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ─── Logo Icon / Avatar ─── */}
      <div
        style={{
          width: isCollapsed ? 40 : 36,
          height: isCollapsed ? 40 : 36,
          minWidth: isCollapsed ? 40 : 36,
          borderRadius: 10,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hasLogo
            ? 'rgba(255,255,255,0.12)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: hasLogo
            ? 'none'
            : '0 2px 8px rgba(99,102,241,0.25)',
          transition: 'all 0.3s ease',
        }}
      >
        {hasLogo ? (
          <img
            className={imgClass}
            src={companyLogoUrl}
            alt={`${displayName} logo`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 3,
            }}
          />
        ) : (
          <span
            style={{
              fontSize: isCollapsed ? 14 : 13,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.5px',
              lineHeight: 1,
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* ─── Company Name (only when expanded) ─── */}
      {!isCollapsed && (
        <div
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: isDark ? '#f1f5f9' : '#1e293b',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: isDark ? 'rgba(148,163,184,0.7)' : '#94a3b8',
              letterSpacing: '0.02em',
              marginTop: 1,
            }}
          >
            Panel de Gestión
          </div>
        </div>
      )}
    </div>
  );
};

Logo.defaultProps = {
  mode: 'light',
  type: 'full',
  logoWidth: 'auto',
  logoHeight: '52px'
};

Logo.propTypes = {
  mode: PropTypes.oneOf(['light', 'dark']),
  type: PropTypes.oneOf(['full', 'streamline']),
  gutter: PropTypes.string,
  imgClass: PropTypes.string,
  logoWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Logo;
