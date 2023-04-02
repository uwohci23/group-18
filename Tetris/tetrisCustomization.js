// color of each tetromino
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };
  
  function changeBlockColor(blockType, newColor) {
    const blockColor = colors[blockType];
  
    if (validColors.includes(newColor)) {
      colors[blockType] = newColor;
    } else if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      colors[blockType] = newColor;
    } else if (/^(rgb|rgba)\([ ]*\d{1,3}[ ]*,[ ]*\d{1,3}[ ]*,[ ]*\d{1,3}[ ]*(,[ ]*\d{1,3}[ ]*)?\)$/.test(newColor)) {
      colors[blockType] = newColor;
    } else {
      console.error(`Invalid color: ${newColor}`);
      return;
    }
  
    console.log(`Changed color of ${blockType} block from ${blockColor} to ${colors[blockType]}`);
  }
  
  function changeBackgroundColor(id, color) {
    const element = document.getElementById(id);
    element.style.backgroundColor = color;
  }
  
  function whiteTheme() {
    for (const blockType in colors) {
      colors[blockType] = "white";
    }
  }
  
  function redBlue() {
    for (const blockType in colors) {
      colors[blockType] = "red";
    }
  
    const elements = [document.getElementById("gameScreen"), document.getElementById("body")];
  
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.backgroundColor = "blue";
    }
  }
  
  function showInput() {
    const blockSelect = document.getElementById("block-select");
    const blockType = blockSelect.value;
    const inputContainer = document.getElementById("input-container");
    const inputField = document.getElementById("block-input");
  }