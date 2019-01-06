import React from "react";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import mealItems, { itemCategories } from "../../mock/mealItems";
import {
  calculateOrderCost,
  calculateSingleMealCost
} from "../../utils/mealCalculator";

const getOptionsForItemCategory = categoryId => {
  return mealItems
    .filter(x => x.categoryId === categoryId)
    .map(x => (
      <option key={x.id} value={x.id}>
        {x.name}
      </option>
    ));
};

const proteinOptions = getOptionsForItemCategory(itemCategories.protein);

const carbohydrateOptions = getOptionsForItemCategory(
  itemCategories.carbohydrate
);

const carbohydratePortions = [
  { id: 1, name: "1/4 cup" },
  { id: 2, name: "1/2 cup" },
  { id: 3, name: "1 cup" }
];
const carbohydratePortionOptions = carbohydratePortions.map(x => (
  <option key={x.id} value={x.id}>
    {x.name}
  </option>
));

const vegetableOptions = getOptionsForItemCategory(itemCategories.vegetable);

const sauceOptions = getOptionsForItemCategory(itemCategories.sauce);
const spiceOptions = getOptionsForItemCategory(itemCategories.spice);
const addonOptions = getOptionsForItemCategory(itemCategories.addon);

const MealBuilderSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too short")
    .max(50, "Too long")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too short")
    .max(50, "Too long")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  meals: Yup.array()
    .of(
      Yup.object().shape({
        protein: Yup.string(),
        proteinPortion: Yup.number(),
        carbohydrate: Yup.string(),
        carbohydratePortion: Yup.string(),
        vegetable: Yup.string(),
        sauce: Yup.string(),
        spice: Yup.string(),
        addon: Yup.string(),
        quantity: Yup.number().min(1)
      })
    )
    .required("Must add at least one meal")
    .min(1, "Must add at least one meal")
});

const defaultMeal = {
  protein: "1",
  proteinPortion: 4,
  carbohydrate: "9",
  carbohydratePortion: "1",
  vegetable: "15",
  quantity: 1,
  spice: "32",
  sauce: "33",
  addon: "29",
  extraSauce: false
};

export default class MealBuilder extends React.Component {
  render() {
    return (
      <div className="meal-builder">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            meals: [{ ...defaultMeal }]
          }}
          validationSchema={MealBuilderSchema}
          onSubmit={(values, actions) => {
            console.log(values);
          }}
          render={({
            values,
            errors,
            status,
            touched,
            isSubmitting,
            handleBlur,
            handleChange
          }) => (
            <Form>
              <label className="form-field" htmlFor="firstName">
                First Name:
              </label>
              <Field type="text" name="firstName" />
              <ErrorMessage name="firstName" component="div" />

              <br />
              <label className="form-field" htmlFor="lastName">
                Last Name:
              </label>
              <Field type="text" name="lastName" />
              <ErrorMessage name="lastName" component="div" />
              <br />
              <label className="form-field" htmlFor="email">
                Email:
              </label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <hr />
              <br />
              <FieldArray
                name="meals"
                render={arrayHelpers => (
                  <div>
                    {values.meals.map((meal, index) => (
                      <div key={index}>
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].protein`}
                        >
                          Protein:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].protein`}
                        >
                          {proteinOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].proteinPortion`}
                        >
                          Protein Portion (oz):
                        </label>
                        <Field
                          type="number"
                          name={`meals[${index}].proteinPortion`}
                          max="10"
                          min="4"
                          step="1"
                        />
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].carbohydrate`}
                        >
                          Carbohydrate:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].carbohydrate`}
                        >
                          {carbohydrateOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].carbohydratePortion`}
                        >
                          Carbohydrate Portion:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].carbohydratePortion`}
                        >
                          {carbohydratePortionOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].vegetable`}
                        >
                          Vegetable:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].vegetable`}
                        >
                          {vegetableOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].sauce`}
                        >
                          Sauce:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].sauce`}
                        >
                          {sauceOptions}
                        </Field>
                        <Field
                          type="checkbox"
                          name={`meals[${index}].extraSauce`}
                        />{" "}
                        Add extra sauce? (+$0.50)
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].spice`}
                        >
                          Spice:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].spice`}
                        >
                          {spiceOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].addon`}
                        >
                          Extra Add-ons:
                        </label>
                        <Field
                          component="select"
                          name={`meals[${index}].addon`}
                        >
                          {addonOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor={`meals[${index}].quantity`}
                        >
                          Quantity:
                        </label>
                        <Field
                          type="number"
                          name={`meals[${index}].quantity`}
                          max="20"
                          min="1"
                          step="1"
                        />
                        <br />
                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={values.meals.length === 1}
                        >
                          Remove
                        </button>
                        <br />
                        <strong>Meal Total:</strong> $
                        {(
                          calculateSingleMealCost(values.meals[index]) *
                          values.meals[index].quantity
                        ).toFixed(2)}{" "}
                        ($
                        {calculateSingleMealCost(values.meals[index]).toFixed(
                          2
                        )}
                        per item)
                        <br />
                        <strong>approximate per meal nutrition info:</strong>
                        <br />
                        calories: 0, fat: 0g, carbs: 0g, protein: 0g
                        <hr />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => arrayHelpers.push({ ...defaultMeal })}
                    >
                      Add Another
                    </button>
                  </div>
                )}
              />
              <br />
              <strong>Total: ${calculateOrderCost(values.meals)}</strong>
              <br />
              {status && status.msg && <div>{status.msg}</div>}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        />
      </div>
    );
  }
}
