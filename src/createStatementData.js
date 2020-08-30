// 중간 데이터 생성을 전담
export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.tatalVolumeCredits = tatalVolumeCredits(statementData);
  statementData.totalAmout = totalAmout(statementData);
  return statementData;

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 30);
    if ("comedy" === perf.play.type) {
      result += Math.floor(perf.audience / 5);
    }
    return result;
  }

  function totalAmout(data) {
    return data.performances.reduce((total, p) => (total += p.amount), 0);
  }

  function tatalVolumeCredits(data) {
    return data.performances.reduce(
      (total, p) => (total += p.volumeCredits),
      0
    );
  }
}

// 모든 데이터 변환을 한 곳에서 수행할 수 있어서 코드가 더욱 명확해진다.
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.performance.play.type}`);
    }
    return result;
  }
}
