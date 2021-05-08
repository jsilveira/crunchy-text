import React, {Component} from 'react';

export default ({icon, level}) => {
  return <span className={`material-icons fs-5 align-middle ${level ? ('text-'+level) : ''}`}>
{icon}
</span>
};
