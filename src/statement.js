function usd(aNumber) {
  // 함수 이름 변경
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100); // 단위 변환 로직도 이 함수 안으로 이동
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  // 임시 변수를 질의 함수로 바꾸기
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  const volumeCreditsFor = (perf) => {
    let result = 0;
    result += Math.max(perf.audience - 30, 30);
    if ("comedy" === playFor(perf).type) {
      result += Math.floor(perf.audience / 5);
    }
    return result;
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

  const tatalVolumeCredits = () => {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
  };

  for (let perf of invoice.performances) {
    // 청구 내역을 출력한다.
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`; // thisAmout 변수를 인라인
    totalAmount += amountFor(perf); // thisAmout 변수를 인라인
  }

  let volumeCredits = tatalVolumeCredits(); // 값 계산 로직을 함수로 추출

  result += ` 총액: ${totalAmount / 100}\n`;
  result += ` 적립 포인트: ${volumeCredits}점\n`;
  return result;
}

export { statement };
