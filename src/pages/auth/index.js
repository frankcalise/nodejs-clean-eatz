import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { authOperations } from "../../state/auth";

const getState = state => {
  return {
    auth: state.auth.user,
    error: state.auth.error,
    allowedUsers: state.auth.allowedUsers
  };
};

const getActions = dispatch => {
  return {
    signIn: (email, password) =>
      dispatch(authOperations.signIn(email, password)),
    registerUser: (email, password) =>
      dispatch(authOperations.registerUser(email, password)),
    fetchAllowedUsers: () => dispatch(authOperations.fetchAllowedUsers())
  };
};

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class SignIn extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.auth) {
      this.context.router.history.push("/");
    }
  }

  componentWillMount() {
    this.props.fetchAllowedUsers();
  }

  onSignIn = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { allowedUsers } = this.props;
    const emails = allowedUsers.map(x => x.email);

    if (emails.indexOf(email) < 0) {
      this.setState({ error: "This email is not authorized to sign in." });
    } else {
      const user = allowedUsers.find(x => x.email === email);
      if (user.uid === true) {
        // need to register
        this.props.registerUser(email, password);
      }

      // process the login
      this.props.signIn(email, password);

      // do error checking before redirecting
      // this.props.history.push("/");
    }
  };

  onChangeEmail = event => {
    this.setState({ email: event.target.value, error: null });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value, error: null });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="headline">Sign in</Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.onChangeEmail}
                  value={this.state.email || ""}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.onChangePassword}
                  value={this.state.password || ""}
                />
              </FormControl>
              {this.props.error && (
                <FormLabel error={true}>{this.props.error}</FormLabel>
              )}
              <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
                onClick={this.onSignIn}
                disabled={
                  this.state.email.length === 0 ||
                  this.state.password.length === 0
                }
              >
                Sign in
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  getState,
  getActions
)(withStyles(styles)(SignIn));
