
const formatReadableProcCode = (procCode, displayNames, paramDelimit = true) => {
    let procCodeArr = procCode.split(' ');
    let counter = 0;
    const isFormatStr = str => str.startsWith("%s")||str.startsWith("%b");
    const replaceSymbol = sym => isFormatStr(sym) ? displayNames[counter++] : sym
    const delimit = (str, isSym) => paramDelimit & isSym ? '(' + str + ')' : str;
    var formatted = procCodeArr.reduce(function (prevVal, currVal, idx) {
        return idx == 0 ? currVal : prevVal + ' ' + delimit(replaceSymbol(currVal), isFormatStr(currVal));
    }, '')
    return formatted;
};
test("format the proc code", () => {
    let procCode = "block1 %s %b and %b %s %";
    let displayNames = ["num", "shouldDo", "isTrue", "step"];
    let formatted = formatReadableProcCode(procCode, displayNames);

    console.log(formatted);

})