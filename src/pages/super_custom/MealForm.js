import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import NumberFormatInput from "../../components/NumberFormatInput";

const proteinOptions = [
  { label: "Turkey", value: "turkey" },
  { label: "Steak", value: "steak" },
  { label: "Chicken", value: "chicken" },
  { label: "Cod", value: "code" },
  { label: "Salmon", value: "salmon" },
  { label: "Tofu", value: "tofu" },
  { label: "Bison +$2.00", value: "bison" }
];

const carbOptions = [
  { label: "None", value: "none" },
  { label: "Sweet Potato", value: "sweetPotato" },
  { label: "Brown Rice", value: "brownRice" },
  { label: "Jasmine Rice +$.50", value: "jasmineRice" },
  { label: "Black Beans", value: "blackBeans" },
  { label: "Cauliflower Rice +$.50", value: "cauliflowerRice" },
  { label: "Quinoa $.50", value: "quinoa" }
];

const vegOptions = [
  { label: "None", value: "none" },
  { label: "Broccoli", value: "broccoli" },
  { label: "Asparagus", value: "asparagus" },
  { label: "Spinach", value: "spinach" },
  { label: "Zucchini", value: "zucchini" },
  { label: "Green Beans", value: "greenBeans" }
];

const unitOptions = [
  {
    label: "g",
    value: "g"
  },
  {
    label: "oz",
    value: "oz"
  }
];

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

class MealForm extends React.Component {
  state = {
    protein: "",
    proteinPortion: 0,
    proteinUnits: "oz",
    carb: "none",
    carbPortion: 0,
    carbUnits: "g",
    vegetable: "none"
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Typography variant="title" gutterBottom>
          Build a meal
        </Typography>
        <Typography variant="subheading" gutterBottom>
          Protein
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={8} sm={4}>
            <TextField
              id="selectProtein"
              select
              label="Select protein"
              className={classes.textField}
              value={this.state.protein}
              onChange={this.handleChange("protein")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {proteinOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8} sm={4}>
            <NumberFormatInput
              id="proteinPortion"
              name="proteinPortion"
              label="Protein portion"
              value={this.state.proteinPortion}
              onChange={this.handleChange("proteinPortion")}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              id="selectProteinUnits"
              select
              label="Portion measurement"
              className={classes.textField}
              value={this.state.proteinUnits}
              onChange={this.handleChange("proteinUnits")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {unitOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Typography variant="subheading" gutterBottom>
          Carbohydrate
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={8} sm={4}>
            <TextField
              id="selectCarb"
              select
              label="Select carbohydate"
              className={classes.textField}
              value={this.state.carb}
              onChange={this.handleChange("carb")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {carbOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8} sm={4}>
            <NumberFormatInput
              id="carbPortion"
              name="carbPortion"
              label="Carbohydate portion"
              value={this.state.carbPortion}
              onChange={this.handleChange("carbPortion")}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              id="selectCarbUnits"
              select
              label="Portion measurement"
              className={classes.textField}
              value={this.state.carbUnits}
              onChange={this.handleChange("carbUnits")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {unitOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Typography variant="subheading" gutterBottom>
          Vegetable
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={8} sm={6}>
            <TextField
              id="selectVeg"
              select
              label="Select vegetable"
              className={classes.textField}
              value={this.state.carb}
              onChange={this.handleChange("veg")}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {vegOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8} sm={6} />
          <Grid item xs={8} sm={6} />
        </Grid>

        {/* <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox color="secondary" name="saveAddress" value="yes" />
              }
              label="Use this address for payment details"
            />
          </Grid> */}
      </React.Fragment>
    );
  }
}

MealForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MealForm);
