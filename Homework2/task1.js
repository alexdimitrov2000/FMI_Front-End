function processData(input) {
    input = input.toLowerCase();
    let distinctChars = input.split("").filter((value, index, arr) => arr.indexOf(value) === index);
    
    let distinctCharsCount = distinctChars.reduce((acc, curr) => {
        acc[curr] = input.split(curr).length - 1;
        return acc;
    }, {});
    
    let charsCount = Object.values(distinctCharsCount);
    
    let maxCnt = Math.max.apply(null, charsCount);
    let numberOfDiffs = 0;
    let diffCnt = -1;
    charsCount.forEach(v =>  {
        if (v !== maxCnt) {
            if (diffCnt === -1) {
                diffCnt = v;
            }

            if (v === diffCnt) {
                numberOfDiffs++;
            }
        }
    });
    
    if (numberOfDiffs === 0) {
        console.log("GOOD");
    }
    else if(numberOfDiffs === 1 || numberOfDiffs === distinctChars.length - 1) {
        console.log("BAD");
    }
    else {
        console.log("UGLY");
    }
}

// processData("ggghhhmmMdddlll");
// processData("ffaafbb");
// processData("llkkfg");
// processData("ssddfff");
// processData("gghmmmdddll");
processData("sdsdsdSd");
processData("-_-_-");
processData("1122332s");
// processData("ggmmhhssssw");