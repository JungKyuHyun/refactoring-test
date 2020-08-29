import createStatementData from "./createStatementData";

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data) {
  // 필요 없어진 인수 삭제
  let result = `청구 내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  result += ` 총액: ${data.totalAmout}\n`;
  result += ` 적립 포인트: ${data.tatalVolumeCredits}점\n`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

export { statement };
