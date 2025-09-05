import React from "react";
import PropTypes from "prop-types";
import { createForm } from "rc-form";
// import createDOMForm from 'rc-form/lib/createDOMForm';

export const FIELD_META_PROP = "data-__meta";
export const FIELD_DATA_PROP = "data-__field";

export default class Form extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  render() {
    const { ...rest } = this.props;
    return <form onSubmit={(e) => e.preventDefault()} {...rest} />;
  }
}

class FormItem extends React.PureComponent {
  getControl(children) {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.find((child) => {
      return FIELD_META_PROP in child.props || "form" in child.props;
    });
  }

  getHelpMessage(control) {
    if (control) {
      const errors = control.props[FIELD_DATA_PROP] && control.props[FIELD_DATA_PROP].errors;
      if (errors && errors.length) {
        return errors[0].message;
      }
    }
  }

  render() {
    const { children } = this.props;
    const control = this.getControl(children);
    const error = this.getHelpMessage(control);
    return React.cloneElement(control, {
      hasError: !!error,
      helpText: error,
    });
  }
}

Form.FormItem = FormItem;

Form.create = function (options = {}) {
  return createForm({
    fieldNameProp: "id",
    ...options,
    fieldMetaProp: FIELD_META_PROP,
    fieldDataProp: FIELD_DATA_PROP,
  });
};
