import React, {Component} from 'react';

export default ({icon, small, large, level, ... other}) => {
  let sizeClass = small ? 'fs-6' : (large ? '' : 'fs-5');
  let colorClass = level ? ('text-' + level) : '';

  return <span className={`material-icons align-middle ${sizeClass} ${colorClass}`} {... other}>
{icon}
</span>
};
