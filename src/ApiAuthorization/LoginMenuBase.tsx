import React, { Component } from "react";
import { NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import { authService } from "./AuthorizeService";
import { ApplicationPaths } from "./ApiAuthorizationConstants";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
export interface AvatarProp {
  logoutPath?: ILogoutPath;
  profilePath?: string;
  urlAvatar?: string;
}

export interface ILoginMenuProps {
  AvatarButton: React.ComponentType<AvatarProp>;
}
export interface ILoginMenuState {
  isAuthenticated: boolean;
  userName?: string;
  avatar?: string;
}
export interface ILogoutPath {
  pathname: string;
  state: { local: boolean };
}
export class LoginMenuBase extends Component<ILoginMenuProps, ILoginMenuState> {
  constructor(props: ILoginMenuProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
    };
  }
  _subscription?: number;
  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription ?? 0);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([
      authService.isAuthenticated(),
      authService.getUser(),
    ]);
    this.setState({
      isAuthenticated,
      userName: user?.name,
      avatar: user?.picture,
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath: ILogoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true },
      };
      return this.authenticatedView(userName ?? "", profilePath, logoutPath);
    }
  }

  authenticatedView(
    userName: string,
    profilePath: string,
    logoutPath: ILogoutPath
  ) {
    const { AvatarButton } = this.props;
    return (
      <>
        <AvatarButton
          urlAvatar={this.state.avatar}
          profilePath={profilePath}
          logoutPath={logoutPath}
        >
          {userName}
        </AvatarButton>
        {/* <NavItem>
          <NavLink tag={Link} className="text-dark" to={profilePath}>
            Hello {userName}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={logoutPath}>
            Logout
          </NavLink>
        </NavItem> */}
      </>
    );
  }

  anonymousView(registerPath: string, loginPath: string) {
    return (
      <>
        <Button style={{ padding: 0 }}>
          <NavLink tag={Link} className="text-primary" to={loginPath}>
            <FontAwesomeIcon className="mr-1" icon={faSignInAlt} />
            Login
          </NavLink>
        </Button>
      </>
    );
  }
}
