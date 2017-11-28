
var rectGrid = (function() {

  var squareMasks = ["three-corner","two-corner", "pyramid-corner"];
  var specialMasks = ["link"];
  var rectMasks = ["link-2", "three-corner-2"];
  var longRectMasks = ["link-3", "link-4"];
  var colors = ["#7537f6","#acffca","#999999","#fff"];
  var gridSize = 50;
  var shapeNo = 10;
  var width = 1000;
  var height = 650;
  var shapeArray = [];

  var start = function() {

    _s = Snap();
    _s.attr({
        viewBox: [0, 0, width, height]
    });

    drawCanvas();

    //place logo
    var logo = new Shape();
    logo.x = (Math.floor((width/2) - (gridSize*4)/2));
    logo.y = (Math.floor((height/2) - (gridSize*5)/2));
    logo.maxX = logo.x + (gridSize*4);
    logo.maxY = logo.y + (gridSize*5);
    logo.mask = "logo";
    logo.square = false;
    logo.smallSquare = false;
    logo.color = "#fff";
    shapeArray.push(logo);

    populateCanvas();
    setInterval(animateRect, 500);
    setInterval(function() {
      populateCanvas();
      if (shapeArray.length > shapeNo) {
        shapeArray.splice(Math.floor(Math.random()*shapeArray.length) + 1, 1);
      }
      console.log(shapeArray.length);
    }, 1000);

  };

  function clear() {
    _s.clear();
    drawCanvas();
  };

  function animateRect() {
    clear();
    for(var i = 0; i < shapeArray.length; i++) {
      if (!(i == 0)) {
        shapeArray[i].update();
      }
      shapeArray[i].show();
    };

  }

  function populateCanvas() {
    clear();

    if (shapeArray.length <= shapeNo) {
      shapeNo += 1;
    }
    else {
      shapeNo += (Math.random() < 0.5 ? -1 : 1);
    }

    while (shapeArray.length <= shapeNo+1) {
      var overlapping = false;
      var newShape = new Shape();
      for (var i = 0; i < shapeArray.length; i++) {
        if (checkOverlap(newShape, shapeArray[i])) {
          overlapping = true;
        }
      }
      if (!overlapping && !checkOutOfBounds(newShape)) {
        shapeArray.push(newShape);
      }
    }

    shapeArray.forEach(function(child) {
      child.show();
    });

  }

  function drawCanvas() {
    var scaledPts = [0, 0, 0, height, width, height, width, 0, 0, 0];
    var roomOutline = _s.polyline(scaledPts).attr({ stroke: '#fff', fill: 'transparent', strokeWidth: 1 });
    var p_line1 = _s.paper.line(0, 0, gridSize, 0).attr({ stroke: '#fff' });
    var p_line2 = _s.paper.line(0, 0, 0, gridSize).attr({ stroke: '#fff' });
    var pattern = _s.paper.g(p_line1, p_line2).pattern(0, 0, gridSize, gridSize);
    roomOutline.attr({ fill: pattern });
  }

  function Shape() {
    this.smallSquare,this.square,this.rect,this.mask,this.maxX,this.maxY;
    this.color = colors[randomNumber(colors)];
    this.x = (Math.floor(Math.random() * (width/gridSize))) * gridSize;
    this.y = (Math.floor(Math.random() * (height/gridSize))) * gridSize;

    var random = Math.floor(Math.random() * 2 ) + 1;

    //make random rect or square

    if (Math.random() > 0.5) {
      this.maxX = this.x + (gridSize * 3 * random);
      this.maxY = this.y + (gridSize * 2 * random);
      this.mask = assignMask(rectMasks,false);
    }
    else if (Math.random() > 0.5) {
      this.maxX = this.x + (gridSize * random);
      this.maxY = this.y + (gridSize * random);
      this.mask = assignMask(squareMasks,true);
      this.square = true;
    }
    else if (Math.random() > 0.5) {
      this.maxX = this.x + (gridSize * 2);
      this.maxY = this.y + (gridSize * 4);
      this.mask = assignMask(longRectMasks,false);
    }
    else {
      this.maxX = this.x + gridSize;
      this.maxY = this.y + gridSize;
      this.mask = assignMask(squareMasks,true);
      this.square = true;
    }

    //check if small square and make smaller squares randomly

    if (this.square && Math.random() > 0.5) {
      this.x = (Math.floor(Math.random() * (width/(gridSize/2)))) * (gridSize/2);
      this.y = (Math.floor(Math.random() * (height/(gridSize/2)))) * (gridSize/2);
      this.maxX = this.x + (gridSize/2);
      this.maxY = this.y + (gridSize/2);
      this.smallSquare = true;
    };

    this.update = function() {

      var projectedObj = {
        x: this.x,
        y: this.y,
        maxX: this.maxX,
        maxY: this.maxY
      };

      var gridMove = this.smallSquare ? gridSize/2 : gridSize;
      var randomSubAdd = Math.random() < 0.5 ? -gridMove : gridMove;
      var overlapping = false;

      if (!this.smallSquare && Math.random() > 0.5) {
        //if square, change size
        if (this.square && (projectedObj.maxX - projectedObj.x > gridSize || projectedObj.maxY - projectedObj.y > gridSize)) {
          projectedObj.maxX += randomSubAdd;
          projectedObj.maxY += randomSubAdd;
        }
        else if (this.square && (projectedObj.maxX - projectedObj.x == gridSize || projectedObj.maxY - projectedObj.y == gridSize)) {
          projectedObj.maxX += gridSize;
          projectedObj.maxY += gridSize;
        }

      }
      else {
        //else, move it around
        if (Math.random() > 0.5) {
          projectedObj.x += randomSubAdd;
          projectedObj.maxX += randomSubAdd;
        }
        else if (Math.random() > 0.5) {
          projectedObj.y += randomSubAdd;
          projectedObj.maxY += randomSubAdd;
        }
      }
      for (var i = 0; i < shapeArray.length; i++) {
        if (!Object.is(this,shapeArray[i]) && checkOverlap(projectedObj, shapeArray[i])) {
          overlapping = true;
        };
      }

      if (!overlapping && !checkOutOfBounds(projectedObj)) {
        this.x = projectedObj.x;
        this.maxX = projectedObj.maxX;
        this.y = projectedObj.y;
        this.maxY = projectedObj.maxY;
      }

    }

    this.show = function() {
      this.rect = _s.rect(this.x,this.y,this.maxX-this.x,this.maxY-this.y).attr({
        mask: _s.image("svg/" + this.mask + ".svg",this.x,this.y,this.maxX - this.x,this.maxY - this.y),
        fill: this.color });
      if (!this.square && !(this.mask == "logo")) {
        this.rect.transform('s' + (Math.random() < 0.5 ? -1 : 1).toString() + ",1")
      }
    };
  }

  function assignMask(maskArray,isSquare) {
    var mask = maskArray[randomNumber(maskArray)];
    if (isSquare) {
      var masks = maskArray.concat(specialMasks);
      mask = maskArray[randomNumber(maskArray)];
    }
    return mask;
  }

  function randomNumber(arr) {
    return (Math.floor(Math.random()*arr.length));
  };

  function checkOverlap(testShape, prevShape) {
    if (testShape.maxX > prevShape.x &&
        testShape.x < prevShape.maxX &&
        testShape.maxY > prevShape.y &&
        testShape.y < prevShape.maxY) {
      return true;
    }
    return false;
  }

  function checkOutOfBounds(testShape) {
    if (testShape.maxX > width || testShape.maxY > height ||
        testShape.x < 0 || testShape.y < 0) {
      return true;
    }
    return false;
  }

  return {
      start: start
  };

})();
