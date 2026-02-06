import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { APP_NAME } from 'constants/app.constant';

const LOGO_SRC_PATH = '/img/logo/';

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

  return (
    <div
      className={classNames('logo', className, gutter)}
      style={{
        ...style,
        width: logoWidth,
        height: logoHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        className={imgClass}
        src="/img/logo/logo-dark-full.png"
        alt={`${APP_NAME} logo`}
        style={{
          width: '100%', // Asegura que la imagen ocupe todo el espacio disponible
          height: '100%', // Asegura que la imagen se ajuste a la altura definida
          objectFit: 'contain' // Hace que la imagen se ajuste sin distorsionarse
        }}
      />
    </div>
  );
};

Logo.defaultProps = {
  mode: 'light',
  type: 'full',
  logoWidth: 'auto',
  logoHeight: '40px'
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
