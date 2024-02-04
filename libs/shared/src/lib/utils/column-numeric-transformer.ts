export class ColumnNumericTransformer {
  to(date: number): number {
    return date;
  }

  from(date: string): number {
    return parseFloat(date);
  }
}
