import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
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

const carbohydatePortions = [
  { id: 1, name: "1/4 cup" },
  { id: 2, name: "1/2 cup" },
  { id: 3, name: "1 cup" }
];
const carbohydratePortionOptions = carbohydatePortions.map(x => (
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
    const user = "test user";
    return (
      <div className="meal-builder">
        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", test: "" }}
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
              <Field type="text" name="firstName" />
              <ErrorMessage name="firstName" component="div" />
              <br />
              <Field type="text" name="lastName" />
              <ErrorMessage name="lastName" component="div" />
              <br />
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
              <br />
              <Field component="select" name="protein">
                {proteinOptions}
              </Field>
              <br />
              <Field
                type="number"
                name="proteinPortion"
                max="10"
                min="4"
                defaultValue={4}
                step="1"
              />
              <br />
              <Field component="select" name="carbohydrate">
                {carbohydrateOptions}
              </Field>
              <br />
              <Field component="select" name="carbohydratePortion">
                {carbohydratePortionOptions}
              </Field>
              <br />
              <Field component="select" name="vegetable">
                {vegetableOptions}
              </Field>
              <br />
              <Field component="select" name="sauce">
                {sauceOptions}
              </Field>
              <br />
              <Field component="select" name="spice">
                {spiceOptions}
              </Field>
              <br />
              <Field component="select" name="addon">
                {addonOptions}
              </Field>
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
