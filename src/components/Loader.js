import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

const Loader = props => {
  const { classes } = props;

  return (
    <div>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

Loader.propTypes = propTypes;

export default withStyles(styles)(Loader);
