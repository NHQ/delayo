module.exports = floatConcat

function floatConcat(first, second)
{

    if(!first) return second;

    var firstLength = first.length;
    var result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}
