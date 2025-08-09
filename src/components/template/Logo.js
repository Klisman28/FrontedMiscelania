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
        height: logoHeight // Se asegura de que el logo tenga la altura correcta
      }}
    >
      <img 
        className={imgClass} 
        src={`${LOGO_SRC_PATH}logo-${mode}-${type}.png`} 
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
  logoWidth: '200px', // Default width of 200px
  logoHeight: '200px' // Default height of 200px
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
