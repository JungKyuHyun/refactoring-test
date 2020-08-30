// 중간 데이터 생성을 전담
export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.tatalVolumeCredits = tatalVolumeCredits(statementData);
  statementData.totalAmout = totalAmout(statementData);
  return statementData;

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
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

// 자바스크립트에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없기 때문에, 생성자를 팩터리 함수로 바꾼다
// 함수를 이용하면 다음과 같이 PerformanceCalculator의 서브 클래스 중에서 어느 것을 생성해서 반환할지 선택할 수 있다.
function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
  }
}

// 모든 데이터 변환을 한 곳에서 수행할 수 있어서 코드가 더욱 명확해진다.
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error("서브클래스에서 처리하도록 설계되었습니다");
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 30);
    if ("comedy" === this.play.type) {
      result += Math.floor(this.performance.audience / 5);
    }
    return result;
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
}
