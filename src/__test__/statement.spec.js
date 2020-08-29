import { statement } from "../statement";
import invoices from "../data/invoices.json";
import plays from "../data/plays.json";

describe("statement() test", () => {
  const RETURN_VALUE = `청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
 총액: 173000
 적립 포인트: 97점
`;

  it("mock 데이터를 반환한다", () => {
    expect(statement(invoices[0], plays)).toBe(RETURN_VALUE);
  });
});
