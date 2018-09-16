import React from "react";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { InputAdornment } from "@material-ui/core";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

class NumberFormatInput extends React.Component {
  render() {
    const { classes, label, id, name, value } = this.props;

    return (
      <TextField
        className={classes.formControl}
        label={label}
        value={value}
        onChange={this.props.onChange}
        id={id}
        name={name}
        InputProps={{
          inputComponent: NumberFormatCustom
          // endAdornment: <InputAdornment position="end">oz</InputAdornment>
        }}
      />
    );
  }
}

NumberFormatInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NumberFormatInput);
