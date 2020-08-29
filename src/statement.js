function usd(aNumber) {
  // 함수 이름 변경
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function statement(invoice, plays) {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

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

  const amountFor = (aPerformance) => {
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
    return result;
  };

  const tatalVolumeCredits = () => {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  };

  // totalAmout가 가장 적절 하지만 이미 중복이 되니, 일단 아무 이름이나 쓴다
  const appleSauce = () => {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
      totalAmount += amountFor(perf);
    }
    return totalAmount;
  };

  for (let perf of invoice.performances) {
    // 청구 내역을 출력한다.
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`;
  }

  let totalAmount = appleSauce();

  result += ` 총액: ${totalAmount / 100}\n`;
  result += ` 적립 포인트: ${tatalVolumeCredits()}점\n`;
  return result;
}

export { statement };
