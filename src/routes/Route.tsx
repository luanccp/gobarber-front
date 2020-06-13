import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType; // chamar o component sem tag
}

/**   (Rota protegida / user logado)
 *    true/true = ok
 *    true/false = redirect login
 *    false/true = redirect dashboard
 *    false/false = ok
 */

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Redirect
            to={{ pathname: isPrivate ? '/' : 'dashboard', state: location }}
          />
        ) : (
          <Component />
        );
      }}
    />
  );
};

export default Route;
