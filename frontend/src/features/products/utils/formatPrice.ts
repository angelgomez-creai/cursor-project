/**
 * Formats a number as currency
 * 
 * @param {number} price - Price to format
 * @param {string} [locale='es-ES'] - Locale for formatting (ISO 639-1)
 * @param {string} [currency='EUR'] - Currency code (ISO 4217)
 * @returns {string} Formatted price string
 * 
 * @example
 * ```typescript
 * // Basic usage
 * formatPrice(99.99) // "99,99 €"
 * formatPrice(1499.99) // "1.499,99 €"
 * 
 * // Different currency
 * formatPrice(99.99, 'en-US', 'USD') // "$99.99"
 * formatPrice(99.99, 'ja-JP', 'JPY') // "¥100"
 * 
 * // In component
 * <Text>{formatPrice(product.price)}</Text>
 * 
 * // With discount
 * <div>
 *   <Text delete>{formatPrice(product.originalPrice)}</Text>
 *   <Text>{formatPrice(product.price)}</Text>
 * </div>
 * ```
 * 
 * @remarks
 * - Automatically handles invalid numbers (NaN, Infinity) → formats as 0
 * - Negative prices are clamped to 0
 * - Uses Intl.NumberFormat for proper localization
 * 
 * @edgeCases
 * - **NaN/Infinity**: Returns formatted "0"
 * - **Negative price**: Clamped to 0 and formatted
 * - **Null/undefined**: Returns formatted "0" (after type coercion)
 * - **Very large numbers**: Handled by Intl.NumberFormat
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat | Intl.NumberFormat}
 */
export const formatPrice = (
  price: number,
  locale: string = 'es-ES',
  currency: string = 'EUR'
): string => {
  // Validar que price sea un número válido
  if (typeof price !== 'number' || isNaN(price) || !isFinite(price)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(0)
  }

  // Manejar precios negativos (no deberían ocurrir pero por seguridad)
  const validPrice = price < 0 ? 0 : price

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(validPrice)
}

