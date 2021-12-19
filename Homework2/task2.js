function processData(input) {
    var result = [0];
    input = eval(input);
    let typeOfElement = "";

    for (let element of input) {
        typeOfElement = typeof element;
        if (typeOfElement === "number") {
            result[0]++;
        }
        else if (typeOfElement === "string") {
            result.push(element.split("").reverse().join(""));
        }
        else if (typeOfElement === "object") {
            if (Array.isArray(element)) {
                result.push(flattenArray(element));
            }
            else {
                let key = Object.keys(element)[0];
                let value = Object.values(element)[0];
                result.push(`${key}: ${value}`);
            }
        }
        else if (typeOfElement === "function") {
            result.push(element.call({}, 42));
        }
    }

    if (result[0] === 0) {
        result.splice(0, 1);
    }
    
    console.log(JSON.stringify(result));

    function flattenArray(arr) {
        let resultArr = [];
        let isNested = false;

        for (let element of arr) {
            if (Array.isArray(element)) {
                resultArr.push(...flattenArray(element));
                isNested = true;
            }
            else {
                resultArr.push(element);
            }
        }

        if (!isNested) {
            return resultArr.sort();
        }

        return resultArr;
    }
}

// processData([1,2,3,4]);
// processData('["test", 1, "world", "42", 2]');
// processData('["test", "1", "world", "42"]');
// processData('["test", 1, "world", "42", 2, { "name": "Pesho" }]');
// processData('["test", 1, "world", "42", 2, { "name": "Pesho" }, [1, 2, 3, [4, 5, [6, 7]]], ["b", "a", "c"]]');
processData('[1, "123456789", [1, 2, [3, 4]], function(a) { return a; }, { "name": "Martin" }, 3, 4, 5, function(a) { return (a + 1)}]');