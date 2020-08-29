function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  // 임시 변수를 질의 함수로 바꾸기
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  const volumeCreditsFor = (perf) => {
    let volumeCredits = 0;
    volumeCredits += Math.max(perf.audience - 30, 30);
    if ("comedy" === playFor(perf).type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }
    return volumeCredits;
  };

  // 함수 추출하기
  const amountFor = (aPerformance) => {
    // 값이 바뀌지 않는 변수는 매개변수로 전달
    let result = 0;

    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result; // 함수 안에서 값이 바뀌는 변수 반환
  };

  for (let perf of invoice.performances) {
    // 포인트를 적립한다.
    volumeCredits += volumeCreditsFor(perf); // 추출한 함수를 이용해 값을 누적

    // 청구 내역을 출력한다.
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`; // thisAmout 변수를 인라인
    totalAmount += amountFor(perf); // thisAmout 변수를 인라인
  }
  result += ` 총액: ${totalAmount / 100}\n`;
  result += ` 적립 포인트: ${volumeCredits}점\n`;
  return result;
}

export { statement };
