import React from "react";
import PropTypes from "prop-types";
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
import firebase, { Auth } from "../../config/firebase";
import { decodeFirebaseKey } from "../../utils/firebaseUtils";

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
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      allowedUsers: null,
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    firebase
      .database()
      .ref("allowedUsers")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const items = snapshot.val();
        const allowedUsers = Object.keys(items).map(x => {
          const value = items[x];
          const key = decodeFirebaseKey(x);
          return { email: key, uid: value };
        });
        this.setState({ allowedUsers });
      });
  };

  onSignIn = e => {
    e.preventDefault();
    const { email, password, allowedUsers } = this.state;
    const emails = allowedUsers.map(x => x.email);

    if (emails.indexOf(email) < 0) {
      this.setState({ error: "This email is not authorized to sign in." });
    } else {
      const user = allowedUsers.find(x => x.email === email);
      if (user.uid === true) {
        // need to register
        Auth.createUserWithEmailAndPassword(email, password).then(
          payload => {
            const { uid } = payload;
            console.log(payload);
            // do firebase set uid in allowedUsers
          },
          error => {
            this.setState({ error: error.message });
            return;
          }
        );
      }
      // process the login
      Auth.signInWithEmailAndPassword(email, password).then(
        payload => {
          // dispatch({ type: "LOGIN", payload });
          console.log(payload);
        },
        error => {
          // dispatch({ type: "LOGIN",k error });
          this.setState({ error: error.message });
          return;
        }
      );
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
              {this.state.error && (
                <FormLabel error={true}>{this.state.error}</FormLabel>
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

export default withStyles(styles)(SignIn);
