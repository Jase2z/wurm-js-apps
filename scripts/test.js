import algebrite from "https://cdn.skypack.dev/algebrite@1.4.0";


function get_skill({difficulty, tool_ql, bonus}){
  bonus = bonus || 0;
}

function get_tool_ql({skill, difficulty, bonus}) {
  bonus = bonus || 0;
}

function get_difficulty({skill, tool_ql, bonus}) {
  bonus = bonus || 0;
  var effective_skill;
  if (ql === undefined) {
        effective_skill = effectiveSkill({bonus:bonus, skill:skill});
    } else {
        effective_skill = effectiveWithItem({skill:skill, ql:ql, bonus:bonus});
    }
  return get_difficulty(effective_skill)
}

function skillCheck({difficulty, skill, ql, bonus}){
    bonus = bonus || 0;
    var effective_skill;
  
    if (ql === undefined){
        effective_skill = effectiveSkill({bonus:bonus, skill:skill});
    } else {
        effective_skill = effectiveWithItem({skill:skill, ql:ql, bonus:bonus});
    }
    return get_gaussian_mean({difficulty:difficulty, effective_skill:effective_skill})
}

function effectiveSkill({skill, bonus}){
    if (bonus > 70){
        bonus = 70;
    }
    var linearMax = (100 + skill) / 2;
    var diffToMaxChange = Math.min(skill, linearMax - skill);
    var newBon = diffToMaxChange * bonus / 100;
    skill += newBon;
    return skill;
}

function effectiveWithItem({skill, ql, bonus}){
    if (bonus > 70){
        bonus = 70;
    }
    var bonusSkill, linearMax;

    if (ql < skill){
        bonusSkill = (skill + ql) / 2;
    } else {
        linearMax = ql - skill;
        bonusSkill = skill + skill * linearMax / 100;
    }
    if (bonus > 0){
        linearMax = (100 + bonusSkill) / 2;
        var diffToMaxChange = Math.min(bonusSkill, linearMax - bonusSkill);
        var newBon = diffToMaxChange * bonus / 100;
        bonusSkill += newBon;
    }
    return bonusSkill;
}

function get_gaussian_mean({difficulty:difficulty, effective_skill:effective_skill}) {
  // from rollGaussian...slide = ((pow(modSkill, 3) - pow(difficulty, 3)) / 50000 + (modSkill - difficulty))
  return ((pow(effective_skill, 3) - pow(difficulty, 3)) / 50000 + (effective_skill - difficulty))
}

function get_difficulty(mod_skill) {
  // from rollGaussian...slide = ((pow(modSkill, 3) - pow(difficulty, 3)) / 50000 + (modSkill - difficulty))
  // algebreticly altered too, where slide is 20:
  //-diff^3 -50,000diff = -mod_skill^3 -50,000mod_skill -1mill
  // Option 1 is to get a cubic equation solver library. Goodness, needle in a haystack -- http://algebrite.org/, https://www.npmjs.com/package/algebrite
  // Option 2, I know diff is 0 to 100 and can estimate at 5 step granularity. Maybe do simulations in steps of 5 for diff looking for whichever is closests to equaling 0.
  var skill = -Math.round(
    -Math.pow(mod_skill, 3) - 50000 * mod_skill + 1000000
  );
  var s = "";
  if (skill < 0) {
    s = "-x^3 -50000x " + skill;
  } else {
    s = "-x^3 -50000x +" + skill;
  }
  //console.log(s);
  var difficulty = algebrite.nroots(s);
  // Object.keys(difficulty) = ["cons","q","k","tensor"]
  // Object.keys(difficulty.tensor) = ["dim","elem","nelem","allocatedId","ndim"]
  // Object.keys(difficulty.tensor.elem) is array or objects and are the possible answers
  var real_val = 0;
  for (let i = 0; i < difficulty.tensor.elem.length; i++) {
    //console.log(Object.keys(difficulty.tensor.elem[i]));
    if (Object.keys(difficulty.tensor.elem[i]).includes("d")) {
      var temp = difficulty.tensor.elem[i].d;
      if (temp > 0) {
        real_val = temp;
        //console.log(i + "  " + real_val);
      }
    }
  }
  return real_val;
}
