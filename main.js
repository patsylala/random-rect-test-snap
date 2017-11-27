
var rectGrid = (function() {

  var squareMasks = ["three-corner","two-corner", "pyramid-corner"];
  var specialMasks = ["link"];
  var rectMasks = ["link-2", "three-corner-2"];
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
    populateCanvas();
    //setInterval(populateCanvas, 5000);
    setInterval(animateRect, 2000);

  };

  function animateRect() {

    _s.clear();
    //shapeArray = [];

    drawCanvas();

    for (var i = 0; i < shapeArray.length-1; i++) {
      if (!checkOverlap(shapeArray[i], shapeArray[i+1]) || !checkOutOfBounds(shapeArray[i])) {
        shapeArray[i].update();
      }
    }

    shapeArray.forEach(function(child) {
      child.show();
    });

  }

  function populateCanvas() {

    while (shapeArray.length < shapeNo) {

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

    //grid pattern from SnapSVGgrid by ajpaul, https://github.com/ajpaul/SnapSVGgrid

    var scaledPts = [0, 0, 0, height, width, height, width, 0, 0, 0];
    var roomOutline = _s.polyline(scaledPts).attr({ stroke: '#fff', fill: 'transparent', strokeWidth: 1 });
    var p_line1 = _s.paper.line(0, 0, gridSize, 0).attr({ stroke: '#fff' });
    var p_line2 = _s.paper.line(0, 0, 0, gridSize).attr({ stroke: '#fff' });
    var pattern = _s.paper.g(p_line1, p_line2).pattern(0, 0, gridSize, gridSize);

    //apply pattern
    roomOutline.attr({ fill: pattern });

  }

  function Shape() {
    this.rect;
    this.mask;
    this.color = colors[randomNumber(colors)];
    this.x = (Math.floor(Math.random() * (width/gridSize))) * gridSize;
    this.y = (Math.floor(Math.random() * (height/gridSize))) * gridSize;
    this.maxX;
    this.maxY;

    var smallSquare = false;
    var random = Math.floor(Math.random() * 2 ) + 1;

    //rect or square
    if (Math.random() > 0.8) {
      this.maxX = this.x + (gridSize * 3 * random);
      this.maxY = this.y + (gridSize * 2 * random);
      this.mask = assignMask(rectMasks,false);
    }
    else if (Math.random() > 0.8) {
      this.maxX = this.x + (gridSize * random);
      this.maxY = this.y + (gridSize * random);
      this.mask = assignMask(squareMasks,true);
    }
    else if (Math.random() > 0.8) {
      this.maxX = this.x + (gridSize * 2 * random);
      this.maxY = this.y + (gridSize * 4 * random);
      this.mask = "link-3"
    }
    else {
      this.maxX = this.x + gridSize;
      this.maxY = this.y + gridSize;
      this.mask = assignMask(squareMasks,true);
      smallSquare = true;
    }

    //check if small square and make smaller squares randomly

    if (smallSquare && Math.random() > 0.2) {
      this.x = (Math.floor(Math.random() * (width/(gridSize/2)))) * (gridSize/2);
      this.y = (Math.floor(Math.random() * (height/(gridSize/2)))) * (gridSize/2);
      this.maxX = this.x + (gridSize/2);
      this.maxY = this.y + (gridSize/2);
    };

    this.update = function() {
      // var randomZero = Math.random() < 0.5 ? gridSize : 0;
      // if (this.maxY > height || this.maxX > width) {
      //   this.maxY -= randomZero;
      //   this.y -= randomZero;
      //
      //   this.maxX -= randomZero;
      //   this.x -= randomZero;
      // }
      // else if (this.y < 0 || this.x < 0) {
      //   this.maxY += randomZero;
      //   this.y += randomZero;
      //
      //   this.maxX += randomZero;
      //   this.x += randomZero;
      // }
      // else {
        var randomSubAdd = Math.random() < 0.5 ? -gridSize : gridSize;
        this.x += randomSubAdd;
        this.maxX += randomSubAdd;

        this.maxY += randomSubAdd;
        this.y += randomSubAdd;
      //}
    }

    // if (Math.random() > 0.3) {
    //   if (this.isSquare) {this.rect.transform("r" + (Math.floor(Math.random()* 4) * 90).toString())}
    //   else {this.rect.transform('s1,' + (Math.random() < 0.5 ? -1 : 1).toString())};
    // }
    // if (Math.random() > 0.3) {
    //   this.rect.attr({ fill: colors[randomNumber(colors)] });
    // }

    this.show = function() {

      this.rect = _s.rect(this.x,this.y,this.maxX-this.x,this.maxY-this.y).attr({
        mask: _s.image("svg/" + this.mask + ".svg",this.x,this.y,this.maxX - this.x,this.maxY - this.y),
        fill: this.color });
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

  function checkOverlap(testShape, prevShape) {
    if (testShape.maxX > prevShape.x &&
        testShape.x < prevShape.maxX &&
        testShape.maxY > prevShape.y &&
        testShape.y < testShape.maxY) {
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

  function valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
  };

  function randomNumber(arr) {
    return (Math.floor(Math.random()*arr.length));
  };

  return {
      start: start
  };

})();
