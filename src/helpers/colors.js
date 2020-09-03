const options = {
  disableColors: false
};

const textToFormat = (open, close, searchRegex, replaceValue) => (txt) =>
  !options.disableColors
    ? open +
      (~(txt += "").indexOf(close, 4) // skip opening \x1b[
        ? txt.replace(searchRegex, replaceValue)
        : txt) +
      close
    : txt
  
const init = (open, close) => {
  return textToFormat(
    `\x1b[${open}m`,
    `\x1b[${close}m`,
    new RegExp(`\\x1b\\[${close}m`, "g"),
    `\x1b[${open}m`
  )
}
const colors = {
 // modifiers
 reset: init(0, 0),
 bold: init(1, 22),
 dim: init(2, 22),
 italic: init(3, 23),
 underline: init(4, 24),

 // colors
 black: init(30, 39),
 red: init(31, 39),
 green: init(32, 39),
 yellow: init(33, 39),
 blue: init(34, 39),
 magenta: init(35, 39),
 cyan: init(36, 39),
 white: init(37, 39),
 gray: init(90, 39),
 grey: init(90, 39),

 // setting options
 options: options
}

module.exports=colors