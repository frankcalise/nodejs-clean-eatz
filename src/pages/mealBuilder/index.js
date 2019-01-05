import React from "react";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import mealItems, { itemCategories } from "../../mock/mealItems";

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
    .required("Required")
});

export default class MealBuilder extends React.Component {
  render() {
    return (
      <div className="meal-builder">
        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", meals: [] }}
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
              <br />
              <FieldArray
                name="meals"
                render={arrayHelpers => (
                  <div>
                    {values.meals.map((meal, index) => (
                      <div key={index}>
                        <label className="form-field" htmlFor="protein">
                          Protein:
                        </label>
                        <Field component="select" name="protein">
                          {proteinOptions}
                        </Field>
                        <br />
                        <label className="form-field" htmlFor="proteinPortion">
                          Protein Portion (oz):
                        </label>
                        <Field
                          type="number"
                          name="proteinPortion"
                          max="10"
                          min="4"
                          defaultValue={4}
                          step="1"
                        />
                        <br />
                        <label className="form-field" htmlFor="carbohydrate">
                          Carbohydrate:
                        </label>
                        <Field component="select" name="carbohydrate">
                          {carbohydrateOptions}
                        </Field>
                        <br />
                        <label
                          className="form-field"
                          htmlFor="carbohydratePortion"
                        >
                          Carbohydrate Portion:
                        </label>
                        <Field component="select" name="carbohydratePortion">
                          {carbohydratePortionOptions}
                        </Field>
                        <br />
                        <label className="form-field" htmlFor="vegetable">
                          Vegetable:
                        </label>
                        <Field component="select" name="vegetable">
                          {vegetableOptions}
                        </Field>
                        <br />
                        <label className="form-field" htmlFor="sauce">
                          Sauce:
                        </label>
                        <Field component="select" name="sauce">
                          {sauceOptions}
                        </Field>
                        <br />
                        <label className="form-field" htmlFor="spice">
                          Spice:
                        </label>
                        <Field component="select" name="spice">
                          {spiceOptions}
                        </Field>
                        <br />
                        <label className="form-field" htmlFor="addon">
                          Extra Add-ons:
                        </label>
                        <Field component="select" name="addon">
                          {addonOptions}
                        </Field>
                        <br />
                        <label className="form-field" htmlFor="quantity">
                          Quantity:
                        </label>
                        <Field
                          type="number"
                          name="quantity"
                          max="20"
                          min="1"
                          defaultValue={1}
                          step="1"
                        />
                        <br />
                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => arrayHelpers.push({})}>
                      +
                    </button>
                  </div>
                )}
              />
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
