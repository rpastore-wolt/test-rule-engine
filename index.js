const { Engine } = require("json-rules-engine");

async function start() {
  const engine = new Engine();

  // Create Range Operator
  engine.addOperator("range", (factValue, jsonValue) => {
    const { left, right } = jsonValue;
    return factValue >= left && factValue < right;
  });

  const range1 = { left: 50, right: 60 };
  const range2 = { left: 70, right: 80 };

  console.log({ range1, range2 });

  // Create a Rule for each range
  const ruleA = {
    conditions: {
      all: [
        {
          fact: "delay",
          operator: "range",
          value: range1,
        },
      ],
    },
    event: {
      type: "range-1",
    },
  };

  const ruleB = {
    conditions: {
      all: [
        {
          fact: "delay",
          operator: "range",
          value: range2,
        },
      ],
    },
    event: {
      type: "range-2",
    },
  };

  // Add Rules to engine
  engine.addRule(ruleA);
  engine.addRule(ruleB);

  const facts = [{ delay: 45 }, { delay: 78 }, { delay: 65 }, { delay: 59 }];

  for (fact of facts) {
    const { events, failureEvents } = await engine.run(fact);

    console.log({ fact, success: events.map((e) => e.type) });
  }

  const ruleC = {
    conditions: {
      all: [
        { fact: "userType", operator: "equal", value: "fist-time-user" },
        {
          fact: "delay",
          operator: "range",
          value: range1,
        },
      ],
    },
    event: {
      type: "range-and-firstTime",
      // rounding: 1.0, TBD
    },
  };

  engine.addRule(ruleC);

  const factC = {
    userType: "fist-time-user",
    delay: 55,
  };
  const { events, failureEvents } = await engine.run(factC);

  console.log({ factC, success: events.map((e) => e.type) });
}

start();
