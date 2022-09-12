export const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "${label} không được để trống!",
  types: {
    // eslint-disable-next-line no-template-curly-in-string
    email: "Email không đúng định dạng!",
    // eslint-disable-next-line no-template-curly-in-string
    number: "${label} không đúng định dạng!",
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: "${label} must be between ${min} and ${max}",
  },
};

// eslint-disable-next-line no-template-curly-in-string
const typeTemplate = "${label} is not a valid ${type}";

export const defaultValidateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  default: "Validation error on field '${label}'",
  // eslint-disable-next-line no-template-curly-in-string
  required: "${label} không được để trống!",
  // eslint-disable-next-line no-template-curly-in-string
  enum: "${label} phải thuộc [${enum}]",
  // eslint-disable-next-line no-template-curly-in-string
  whitespace: "${label} không được trống",
  date: {
    // eslint-disable-next-line no-template-curly-in-string
    format: "${label} is invalid for format date",
    // eslint-disable-next-line no-template-curly-in-string
    parse: "${label} could not be parsed as date",
    // eslint-disable-next-line no-template-curly-in-string
    invalid: "${label} is invalid date",
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    // eslint-disable-next-line no-template-curly-in-string
    len: "${label} must be exactly ${len} characters",
    // eslint-disable-next-line no-template-curly-in-string
    min: "${label} phải lớn hơn ${min} kí tự",
    // eslint-disable-next-line no-template-curly-in-string
    max: "${label} phải nhỏ hơn ${max} kí tự",
    // eslint-disable-next-line no-template-curly-in-string
    range: "${label} phải có độ dài từ ${min} đến ${max} kí tự",
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    len: "${label} must equal ${len}",
    // eslint-disable-next-line no-template-curly-in-string
    min: "${label} cannot be less than ${min}",
    // eslint-disable-next-line no-template-curly-in-string
    max: "${label} cannot be greater than ${max}",
    // eslint-disable-next-line no-template-curly-in-string
    range: "'${label}' must be between ${min} and ${max}",
  },
  array: {
    // eslint-disable-next-line no-template-curly-in-string
    len: "${label} must be exactly ${len} in length",
    // eslint-disable-next-line no-template-curly-in-string
    min: "${label} cannot be less than ${min} in length",
    // eslint-disable-next-line no-template-curly-in-string
    max: "${label} cannot be greater than ${max} in length",
    // eslint-disable-next-line no-template-curly-in-string
    range: "${label} must be between ${min} and ${max} in length",
  },
  pattern: {
    // eslint-disable-next-line no-template-curly-in-string
    mismatch: "${label} does not match pattern ${pattern}",
  },
};

export const layout = {
  labelCol: {span: 9},
  wrapperCol: {span: 15},
};
