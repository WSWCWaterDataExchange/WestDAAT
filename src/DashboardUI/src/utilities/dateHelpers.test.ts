import { parseDateOnly } from './dateHelpers';

describe('dateHelpers', () => {
  describe('parseDateOnly', () => {
    it('should return a date object with the correct year, month, and day', () => {
      // Arrange
      const dateOnlyString = '2021-01-01';

      // Act
      const result = parseDateOnly(dateOnlyString);

      // Assert
      expect(result.getFullYear()).toBe(2021);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });
});
