import { formatDateString, formatNumber } from './valueFormatters';

describe('formatNumber', () => {
  test.each([
    [0, 0, '0'],
    [0, 1, '0.0'],
    [0, 2, '0.00'],
    [0, 20, '0.00000000000000000000'],
    [0, undefined, '0'],

    [1, 0, '1'],
    [1, 1, '1.0'],
    [1, 2, '1.00'],
    [1, 20, '1.00000000000000000000'],
    [1, undefined, '1'],

    [123, 0, '123'],
    [123, 1, '123.0'],
    [123, 2, '123.00'],
    [123, 20, '123.00000000000000000000'],
    [123, undefined, '123'],

    [123.4, 0, '123'],
    [123.4, 1, '123.4'],
    [123.4, 2, '123.40'],
    [123.4, 20, '123.40000000000000000000'],
    [123.4, undefined, '123.4'],

    [123.5, 0, '124'],
    [123.45, 1, '123.5'],
    [123.455, 2, '123.46'],

    [123.456, 0, '123'],
    [123.456, 1, '123.5'],
    [123.456, 2, '123.46'],
    [123.456, 20, '123.45600000000000000000'],
    [123.456, undefined, '123.456'],

    [123.456789, 0, '123'],
    [123.456789, 1, '123.5'],
    [123.456789, 2, '123.46'],
    [123.456789, 20, '123.45678900000000000000'],
    [123.456789, undefined, '123.456789'],

    [12.34, { minimumFractionDigits: 0 }, '12.34'],
    [12.34, { minimumFractionDigits: 1 }, '12.34'],
    [12.34, { maximumFractionDigits: 0 }, '12'],
    [12.34, { maximumFractionDigits: 1 }, '12.3'],
    [12.34, { minimumFractionDigits: 0, maximumFractionDigits: 0 }, '12'],
    [12.34, { minimumFractionDigits: 0, maximumFractionDigits: 1 }, '12.3'],
    [12.34, { minimumFractionDigits: 1, maximumFractionDigits: 1 }, '12.3'],

    [null, undefined, ''],
    [null, 0, ''],
    [null, 1, ''],
    [undefined, undefined, ''],
    [undefined, 0, ''],
    [undefined, 1, ''],
  ])('value: %s, decimals: %s', (value, decimals, expected) => {
    expect(formatNumber(value, decimals)).toBe(expected);
  });
});

describe('formatDateString', () => {
  describe('should return the formatted date string', () => {
    it('in MM/DD/YYYY format', () => {
      // Arrange
      const date = new Date('2021-01-01T00:00:00.000Z');

      // Act
      const result = formatDateString(date, 'MM/DD/YYYY');

      // Assert
      expect(result).toStrictEqual('12/31/2020');
    })
  });
});