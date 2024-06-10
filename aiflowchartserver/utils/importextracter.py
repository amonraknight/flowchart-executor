import re


def _getAllImportLibRows(scriptTxt):
    pattern = r'from .+ import .+|import .+'
    matchingLines = re.findall(pattern, scriptTxt, re.MULTILINE)
    # print(matchingLines)
    return matchingLines


def getImportScript(scriptTxt):
    matchingLines = _getAllImportLibRows(scriptTxt)

    importScript = ''
    for eachRow in matchingLines:
        # print(eachRow)
        importScript = importScript + eachRow + '\n'
    return importScript
