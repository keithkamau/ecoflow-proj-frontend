export function required(value, fieldName = "This field") {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}

export function mustBePositive(value, fieldName = "Value") {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be greater than zero`;
  }
  return null;
}

export function validateOfferForm(values) {
  const errors = {};
  const materialErr = required(values.material_id, "Material type");
  if (materialErr) errors.material_id = materialErr;
  const priceErr = mustBePositive(values.offered_price, "Offered price");
  if (priceErr) errors.offered_price = priceErr;
  const qtyErr = mustBePositive(values.quantity, "Quantity");
  if (qtyErr) errors.quantity = qtyErr;
  return errors;
}
