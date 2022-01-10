const randomCheck = (chance) => {
  return Math.random() < chance;
}
const scrollCheck = () => randomCheck(0.1);
const factorySetCheck = scrollCheck;
const wellCheck = () => randomCheck(0.05);
const botOutfitCheck = wellCheck;
const botAmmyCheck = wellCheck;

const makeUnf = (herbs, {scroll, well, botOutfit}) => {
  const herbsLeft = (scroll && scrollCheck()) ? herbs : herbs - 1;

  const wellPot = (well && wellCheck()) ? 1 : 0;
  const botOutfitPot = (botOutfit && botOutfitCheck()) ? 1 : 0;

  return {herbs: herbsLeft, unfs: 1 + wellPot + botOutfitPot}
}

const makePot = ({scroll, well, botOutfit, botAmmy, factorySet}) => {
  const secs = (scroll && scrollCheck()) ? 0 : 1;

  const botAmmyUses = (botAmmy && botAmmyCheck()) ? 1 : 0;
  const factorySetUsed = (botAmmyUses === 0 && factorySet && factorySetCheck()) ? 1 : 0;
  const baseDoses = (botAmmyUses || factorySetUsed) ? 4 : 3;
  const wellDoses = (well && wellCheck()) ? baseDoses : 0;
  const botOutfitDoses = (botOutfit && botOutfitCheck()) ? baseDoses : 0;

  return {secs, doses: baseDoses + wellDoses + botOutfitDoses, ammyCharges: botAmmyUses}
}

const runTrial = (totalStarting, settings = {}, useUnfs) => {
  let totalHerbs = 0;
  let totalUnfs = useUnfs ? totalStarting : 0;
  for (let remainingHerbs = useUnfs ? 0 : totalStarting; remainingHerbs > 0;) {
    const {herbs, unfs} = makeUnf(remainingHerbs, settings);
    totalHerbs ++;
    totalUnfs += unfs;
    remainingHerbs = herbs;
  }
  let totalSecs = 0;
  let totalDoses = 0;
  let totalAmmyCharges = 0;
  for (let remainingUnfs = totalUnfs; remainingUnfs > 0;) {
    const {secs, doses, ammyCharges} = makePot(settings);
    remainingUnfs --;
    totalSecs += secs;
    totalDoses += doses;
    totalAmmyCharges += ammyCharges
  }
  return {totalHerbs, totalUnfs, totalSecs, totalDoses, totalAmmyCharges};
}

const initPage = () => {
  const secCost = 119524;
  const unfCost = 26450;
  const doseVal = 39000;
  const ammyChargVal = 1979.2;
  const {totalHerbs, totalUnfs, totalSecs, totalDoses, totalAmmyCharges} = runTrial(10000,
      {scroll: true, well: true, botOutfit: true, botAmmy: true},
      true);
  const threeDose = totalDoses / 3;
  const fourDose = totalDoses / 4;
  const totalCost = secCost * totalSecs + unfCost * totalUnfs + ammyChargVal * totalAmmyCharges;
  const totalVal = doseVal * totalDoses;
  const profit = totalVal - totalCost;
  $("#everythingWrapper").text(`Starting with 10000 herbs, ended up using a total of ${totalHerbs} herbs to make 
  ${totalUnfs} unfs. Then used ${totalSecs} secondaries to make a total of ${totalDoses} doses of potion: ${threeDose} 
  3 dose pots or ${fourDose} four dose pots. This used up ${totalAmmyCharges} charges of botanist amulet.
  
  This cost ${totalCost} gp and sold for ${totalVal} gp resulting in a profit of ${profit} gp.`);
}

document.addEventListener("DOMContentLoaded", initPage);