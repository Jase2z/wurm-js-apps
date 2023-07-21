import algebrite from "https://cdn.skypack.dev/algebrite@1.4.0"

function get_difficulty(mod_skill) {
  // from rollGaussian...slide = ((pow(modSkill, 3) - pow(difficulty, 3)) / 50000 + (modSkill - difficulty))
  // algebreticly altered too, where slide is 20:
  //-diff^3 -50,000diff = -mod_skill^3 -50,000mod_skill + 1mill
  // Option 1 is to get a cubic equation solver library. Goodness, needle in a haystack -- http://algebrite.org/, https://www.npmjs.com/package/algebrite
  // Option 2, I know diff is 0 to 100 and can estimate at 5 step granularity. Maybe do simulations in steps of 5 for diff looking for whichever is closests to equaling 0.
  
  // algebrite.nroots(s)  Doesn't like decimals so round skill.
  var skill = -Math.round(
    -Math.pow(mod_skill, 3) - 50000 * mod_skill + 1000000
  );
  var s = "";
  if (skill < 0) {
    s = "-x^3 -50000x " + skill;
  } else {
    s = "-x^3 -50000x +" + skill;
  }
  var difficulty = algebrite.nroots(s);
  // Object.keys(difficulty) = ["cons","q","k","tensor"]
  // Object.keys(difficulty.tensor) = ["dim","elem","nelem","allocatedId","ndim"]
  // Object.keys(difficulty.tensor.elem) is array or objects and are the possible answers
  var real_val = 0;
  for (let i = 0; i < difficulty.tensor.elem.length; i++) {
    if (Object.keys(difficulty.tensor.elem[i]).includes("d")) {
      var temp = difficulty.tensor.elem[i].d;
      if (temp > 0) {
        real_val = temp;
      }
    }
  }
  return real_val;
}

function get_farm_group(difficulty) {
  var toReturn;
  if ( difficulty < 5.5) {
    // potato at 4 diff.
    toReturn = {
      easy: "nothing at 0 difficulty.",
      challenge: "potato at 4 difficulty.",
      hard: "cotton at 7 difficulty."
    };
  } else if (difficulty >= 5.5 && difficulty < 8.5) {
    // cotton at 7 diff.
    toReturn = {
      easy: "potato at 4 difficulty.",
      challenge: "cotton at 7 difficulty.",
      hard: "wemp and rye at 10 difficulty."
    };
  } else if (difficulty >= 8.5 && difficulty < 12.5) {
    // rye and wemp at 10 diff.
    toReturn = {
      easy: "cotton at 7 difficulty.",
      challenge: "wemp and rye at 10 difficulty.",
      hard: "oat, cucumber, and pumpkin at 15 difficulty."
    };
  } else if (difficulty >= 12.5 && difficulty < 17.5) {
    // oat, cucumber, and pumpkin at 15 diff.
    toReturn = {
      easy: "wemp and rye at 10 difficulty.",
      challenge: "oat, cucumber, and pumpkin at 15 difficulty.",
      hard: "barley and reed at 20 difficulty."
    };
  } else if (difficulty >= 17.5 && difficulty < 22.5) {
    // barley and reed at 20 diff.
    toReturn = {
      easy: "oat, cucumber, and pumpkin at 15 difficulty.",
      challenge: "barley and reed at 20 difficulty.",
      hard: "carrot at 25 difficulty."
    };
  } else if (difficulty >= 22.5 && difficulty < 27.5) {
    // carrot at 25 diff.
    toReturn = {
      easy: "barley and reed at 20 difficulty.",
      challenge: "carrot at 25 difficulty.",
      hard: "wheat at 30 difficulty."
    };
  } else if (difficulty >= 27.5 && difficulty < 32.5) {
    // wheat at 30 diff.
    toReturn = {
      easy: "carrot at 25 difficulty.",
      challenge: "wheat at 30 difficulty.",
      hard: "cabbage at 35 difficulty."
    };
  } else if (difficulty >= 32.5 && difficulty < 37.5) {
    // cabbage at 35 diff.
    toReturn = {
      easy: "wheat at 30 difficulty.",
      challenge: "cabbage at 35 difficulty.",
      hard: "corn at 40 difficulty."
    };
  } else if (difficulty >= 37.5 && difficulty < 42.5) {
    // corn at 40 diff.
    toReturn = {
      easy: "cabbage at 35 difficulty.",
      challenge: "corn at 40 difficulty.",
      hard: "tomatoes at 45 difficulty."
    };
  } else if (difficulty >= 42.5 && difficulty < 50) {
    // tomatoes at 45 diff.
    toReturn = {
      easy: "corn at 40 difficulty.",
      challenge: "tomatoes at 45 difficulty.",
      hard: "lettus at 55 difficulty."
    };
  } else if (difficulty >= 50 && difficulty < 57.5) {
    // lettus at 55 diff.
    toReturn = {
      easy: "tomatoes at 45 difficulty.",
      challenge: "lettus at 55 difficulty.",
      hard: "onion and strawberry at 60 difficulty."
    };
  } else if (difficulty >= 57.5 && difficulty < 62.5) {
    // onion and strawberry at 60 diff.
    toReturn = {
      easy: "lettus at 55 difficulty.",
      challenge: "onion and strawberry at 60 difficulty.",
      hard: "peas at 65 difficulty."
    };
  } else if (difficulty >= 62.5 && difficulty < 67.5) {
    // peas at 65 diff.
    toReturn = {
      easy: "onion and strawberry at 60 difficulty.",
      challenge: "peas at 65 difficulty.",
      hard: "garlic at 70 difficulty."
    };
  } else if (difficulty >= 67.5 && difficulty < 75) {
    // garlic at 70 diff.
    toReturn = {
      easy: "peas at 65 difficulty.",
      challenge: "garlic at 70 difficulty.",
      hard: "rice at 80 difficulty."
    };
  } else if (difficulty >= 75 && difficulty < 82.5) {
    // rice at 80 diff.
    toReturn = {
      easy: "garlic at 70 difficulty.",
      challenge: "rice at 80 difficulty.",
      hard: "sugar beat at 85 difficulty."
    };
  } else if (difficulty >= 82.5) {
    // sugar beat at 85 diff.
    toReturn = {
      easy: "rice at 80 difficulty.",
      challenge: "sugar beat at 85 difficulty.",
      hard: "nothing harder then 85 difficulty."
    };
  }
  document.getElementById("Easy_span").innerHTML = toReturn.easy;
  document.getElementById("Challenge_span").innerHTML = toReturn.challenge;
  document.getElementById("Hard_span").innerHTML = toReturn.hard;
  return toReturn;
}

/**
 * Find effective skill using skill, tool ql and bonus.
 * @param {number} skill - the character's skill.
 * @param {number} tool_ql - the quality of tool used.
 * @param {number} bonus - A buff skill.
 * @returns {number}
 */
function effective_skill(skill, tool_ql, bonus=0){
  skill = Number(skill);
  let eff, linear_max;
  tool_ql = Number(tool_ql);  

  if (tool_ql < skill) {
    // A tool can reduce skill by equal weighting.
    eff = (skill + tool_ql) / 2;
  } else {
    // A tool shouldn't increase skill by equal weighting. Limit to < 100% 
    // increase on skill and have the amount by which tool ql exceds skill be 
    // the % increase.
    // linear_max is the % of skill increase.
    linear_max = tool_ql - skill;
    eff = skill + skill * linear_max / 100;
  }

  bonus = Number(bonus);
  if (bonus > 70){
    bonus = 70;
  }
  // 1. bonus is a % of effective_Skill up to about 33 effective_Skill. Then
  //    it's slowly(linear) phased out and 100 skill it is 0. Bonus is 
  //    multipled by diffToMaxChange after about 33 effective_Skill and
  //    eventually it hits 0 giving no bonus.
  // 2. I need diffToMaxChange value as an estimator to increase simplafied 
  //    difficulty (effective skill - 20).
  linear_max = (100 + eff) / 2;
  var diffToMaxChange = Math.min(eff, linear_max - eff);
  
  if (bonus > 0) {
    var new_bon = diffToMaxChange * bonus / 100;
    eff += new_bon;
  }

  return eff;
}

/**
 * @param {number} diff 
 * @param {number} eff 
 * @returns {number}
 */
function get_gaussian_mean(diff, eff) {
  var diff = Number(diff);
  var eff = Number(eff);
  //  from rollGaussian...slide = ((pow(modSkill, 3) - pow(difficulty, 3))
  //    / 50000 + (modSkill - difficulty))
  return ((Math.pow(eff, 3) - Math.pow(diff, 3)) / 50000 + (eff - diff))
}

/**
 *  Get crop that best matches difficulty and skill. Optimal difficulty is when
 *  gaussian mean is 20.
 * @param {number} skill 
 * @param {number} rake_ql 
 * @param {number} rake_skill 
 * @param {number} nature_skill 
 * @returns {object[]} 
 */
function farming_get_diff(skill, rake_ql, rake_skill, nature_skill) {
  let f_skills = [];
  let f_skill = {order:1000, bonus:0, eff:0, mean:0, diff:0}
  f_skills.push(f_skill)
  let _eff = effective_skill(skill, rake_ql, 0);
  let _bonus; let _mean; let _order; let index; let for_end;
  if (_eff - 30 < 0) {
    index = 0
    for_end = _eff
  } else {
    index = _eff - 30
    for_end = _eff
  }
  for (; index < for_end; index++) {
    _bonus = get_gaussian_mean(index, nature_skill) / 10;
    _bonus += get_gaussian_mean(index, rake_skill);
    _bonus = Math.min(70, _bonus);
    _bonus = Math.max(0, _bonus);
    _eff = effective_skill(skill, rake_ql, _bonus);
    _mean = get_gaussian_mean(index, _eff);
    _order = Math.abs(_mean - 20)
    f_skill = {order:_order, bonus:_bonus, eff:_eff, mean:_mean, diff:index}
    f_skills.push(f_skill)
  }
  f_skills.sort(function(a, b){return a.order - b.order})
  const x = f_skills[0]
  console.log(f_skills)
  console.log("bonus:" + x.bonus.toFixed(2) + " mean:" + x.mean.toFixed(2) 
    + " eff:" + x.eff.toFixed(2) + " diff:" + x.diff)
  
  return {eff1:x.eff, diff1:x.diff, bonus:x.bonus}
}

function farmingOld(skill, difficulty, rake_ql, rake_skill, nature_skill) {
  if(skill === undefined) {

  }
  if (difficulty === undefined) {
    nature_skill = nature_skill || Math.round(skill * 0.50);
    // To calculate difficulty bonus is needed, but to get bonus difficulty 
    // is needed! 
    // Use effective_skill - 20 equals difficulty for bonus modifier related.
    // eff:eff, diff_estimator:diffToMaxChange
    var eff_skill = effective_skill(skill, rake_ql);
    var eff_no_b = eff_skill.eff
    var eff2 = eff_no_b
    var estimate_diff = get_difficulty(eff_no_b) * (1 + eff_skill.diff_estimator / 100);
    var diff2 = estimate_diff
    console.log("*************************************")
    console.log("calc diff: " + Math.round(estimate_diff))
    console.log("less 20: " + (Math.round(eff_no_b) - 20))

    eff_skill = effective_skill(rake_skill, rake_ql, estimate_diff);
    console.log("eff rake: " + eff_skill.eff)
    var rake_skill_effective = eff_skill.eff
    var rake_bonus = get_gaussian_mean(estimate_diff, rake_skill_effective);
    console.log("rake b: " + rake_bonus)
    var nature_bonus = get_gaussian_mean(estimate_diff, nature_skill) / 10;
    var bonus = rake_bonus + nature_bonus;
    console.log(bonus);
    eff_skill = effective_skill(skill, rake_ql, bonus); 
    var eff1 = eff_skill.eff
    var diff1 = get_difficulty(eff1);
    console.log("b sk, dif:\n" + Math.round(eff1) + ", " + Math.round(diff1))
    console.log("sk, dif:\n" + Math.round(eff2) + ", " + Math.round(diff2))
    return {diff1:diff1, eff1:eff1, diff2:diff2, eff2:eff2};
  }
}


const skill_label_default = "Farming skill: ... "
const skill_input = document.getElementById("skill_in");
const skill_label = document.getElementById("skill_in_label");
skill_label.innerHTML = skill_label_default + skill_input.value;

const tool_ql_default = "Tool QL: ........... "
const tool_ql_input = document.getElementById("tool_ql_in");
const tool_ql_label = document.getElementById("tool_ql_label");
tool_ql_label.innerHTML = tool_ql_default + tool_ql_input.value;

const tool_skill_default = "Tool skill: ......... "
const tool_skill_input = document.getElementById("tool_skill_in");
const tool_skill_label = document.getElementById("tool_skill_label");
tool_skill_label.innerHTML = tool_skill_default + tool_skill_input.value;

const parent_skill_default = "Parent skill: ...... "
const parent_skill_input = document.getElementById("parent_skill_in");
const parent_skill_label = document.getElementById("parent_skill_label");
parent_skill_label.innerHTML = parent_skill_default + parent_skill_input.value;

var farm_result = farming_get_diff(document.getElementById("skill_in").value, 
                        document.getElementById("tool_ql_in").value,
                        document.getElementById("tool_skill_in").value,
                        document.getElementById("parent_skill_in").value);

document.getElementById("Modified_span").innerHTML = 
  String(farm_result.eff1.toFixed(1)).padStart(4, "0");
document.getElementById("diff_span").innerHTML = 
  String(farm_result.diff1.toFixed(1)).padStart(4, "0");
get_farm_group(farm_result.diff1);


const group_skills = document.getElementById("group_skills");

group_skills.onclick = function () {
  if (group_skills.checked){
    group_skills.checked = false;
  } else {
    group_skills.checked = true;
  }

  if (group_skills.hasAttributes()) {
    let output
    for (const attr of group_skills.attributes) {
      output += `${attr.name} -> ${attr.value}\n`;
    }
    console.log(output)

  } else {
    console.log("no attributes")
  }
}

skill_input.oninput = function () {

  skill_label.innerHTML = skill_label_default + String(skill_input.value).padStart(2, "0");
  var farm_result = farming_get_diff(this.value,
                          document.getElementById("tool_ql_in").value,
                          document.getElementById("tool_skill_in").value,
                          document.getElementById("parent_skill_in").value);
  document.getElementById("Modified_span").innerHTML = 
    String(farm_result.eff1.toFixed(1)).padStart(4, "0");
  document.getElementById("diff_span").innerHTML = 
    String(farm_result.diff1.toFixed(1)).padStart(4, "0");
  get_farm_group(farm_result.diff1);
};

tool_ql_input.oninput = function () {
  tool_ql_label.innerHTML = tool_ql_default 
    + String(tool_ql_input.value).padStart(2, "0");
  var farm_result = farming_get_diff( document.getElementById("skill_in").value,  
                          this.value,
                          document.getElementById("tool_skill_in").value,
                          document.getElementById("parent_skill_in").value);
  document.getElementById("Modified_span").innerHTML = 
    String(farm_result.eff1.toFixed(1)).padStart(4,"0");
  document.getElementById("diff_span").innerHTML = 
    String(farm_result.diff1.toFixed(1)).padStart(4,"0");
  get_farm_group(farm_result.diff1);
};

tool_skill_input.oninput = function () {
  tool_skill_label.innerHTML = tool_skill_default 
    + String(tool_skill_input.value).padStart(2, "0");
  var farm_result = farming_get_diff( document.getElementById("skill_in").value, 
                         document.getElementById("tool_ql_in").value,
                         this.value,
                         document.getElementById("parent_skill_in").value);
  document.getElementById("Modified_span").innerHTML = 
    String(farm_result.eff1.toFixed(1)).padStart(4,"0");
  document.getElementById("diff_span").innerHTML = 
    String(farm_result.diff1.toFixed(1)).padStart(4,"0");
  get_farm_group(farm_result.diff1);
}

parent_skill_input.oninput = function () {
  parent_skill_label.innerHTML = parent_skill_default 
    + String(parent_skill_input.value).padStart(2, "0");
  var farm_result = farming_get_diff( document.getElementById("skill_in").value, 
                         document.getElementById("tool_ql_in").value,
                         document.getElementById("tool_skill_in").value,
                         this.value);
  document.getElementById("Modified_span").innerHTML = 
    String(farm_result.eff1.toFixed(1)).padStart(4,"0");
  document.getElementById("diff_span").innerHTML = 
    String(farm_result.diff1.toFixed(1)).padStart(4,"0");
  get_farm_group(farm_result.diff1);
}