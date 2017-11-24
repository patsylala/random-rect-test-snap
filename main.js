
var rectGrid = (function() {

  var squareMasks = ["three-corner","two-corner", "pyramid-corner"];
  var specialMasks = ["link"];
  var rectMasks = ["link-2", "three-corner-2"];
  var colors = ["#7537f6","#acffca","#999999","#fff"];
  var gridSize = 50;
  var shapeNo = 40;
  var width = 1000;
  var height = 650;
  var shapeArray = [];

  var start = function() {

    _s = Snap();
    _s.attr({
        viewBox: [0, 0, width, height]
    });

    populateCanvas();
    setInterval(populateCanvas, 1000);
    setInterval(animation, 500);

  };

  function animation() {
    shapeArray.forEach(function(child) {
      child.update();
    });
  }

  function populateCanvas() {

    _s.clear();
    shapeArray = [];

    //grid pattern from SnapSVGgrid by ajpaul, https://github.com/ajpaul/SnapSVGgrid

    var scaledPts = [0, 0, 0, height, width, height, width, 0, 0, 0];
    var roomOutline = _s.polyline(scaledPts).attr({ stroke: '#fff', fill: 'transparent', strokeWidth: 1 });
    var p_line1 = _s.paper.line(0, 0, gridSize, 0).attr({ stroke: '#fff' });
    var p_line2 = _s.paper.line(0, 0, 0, gridSize).attr({ stroke: '#fff' });
    var pattern = _s.paper.g(p_line1, p_line2).pattern(0, 0, gridSize, gridSize);

    //apply pattern
    roomOutline.attr({ fill: pattern });

    while (shapeArray.length < shapeNo) {

      var overlapping = false;
      var newShape = new Shape();

      for (var i = 0; i <= shapeArray.length-1; i++) {
        if (checkOverlap(newShape, shapeArray[i])) {
          overlapping = true;
        }
      }

      if (!overlapping) {
        shapeArray.push(newShape);
      }
    }
    shapeArray.forEach(function(child) {
      child.show();
    });
  }

  function Shape() {
    this.rect;
    this.x = (Math.floor(Math.random() * (width/gridSize)) + 1) * gridSize;
    this.y = (Math.floor(Math.random() * (height/gridSize)) + 1) * gridSize;

    this.maxX = this.x + gridSize;
    this.maxY = this.y + gridSize;

    this.bigSquare = false;
    this.longRect = false;
    this.isSquare = false;

    //rect or square
    if (Math.random() > 0.8) {
      var random = Math.floor(Math.random() * 2 ) + 1;
      this.maxX = this.x + (gridSize * 3 * random);
      this.maxY = this.y + (gridSize * 2 * random);
    }
    else if (Math.random() > 0.8) {
      var random = Math.floor(Math.random() * 5 ) + 1;
      this.maxX = this.x + (gridSize * random);
      this.maxY = this.y + (gridSize * random);
      this.bigSquare = true;
    }
    else if (Math.random() > 0.8) {
      var random = Math.floor(Math.random() * 2 ) + 1;
      this.maxX = this.x + (gridSize * 2 * random);
      this.maxY = this.y + (gridSize * 4 * random);
      this.longRect = true;
    }

    //check if out of bounds

    if (this.maxX >= width) {
      this.x = this.x - (this.maxX - this.x);
      this.maxX = this.maxX - (this.maxX - this.x);
    }

    if (this.maxY >= height) {
      this.y = this.y - (this.maxY - this.y);
      this.maxY = this.maxY - (this.maxY - this.y);
    }

    //check if small square and make smaller squares randomly

    if ((this.maxX - this.x) == (this.maxY - this.y) ) {
      this.isSquare = true;
      if (!this.bigSquare) {
        if (Math.random() > 0.2) {
          this.x = (Math.floor(Math.random() * (width/(gridSize/2))) + 1) * (gridSize/2);
          this.y = (Math.floor(Math.random() * (height/(gridSize/2))) + 1) * (gridSize/2);
          this.maxX = this.x + (gridSize/2);
          this.maxY = this.y + (gridSize/2);
        }
      }
    };

    this.update = function() {
      if (Math.random() > 0.3) {
        if (this.isSquare) {this.rect.transform("r" + (Math.floor(Math.random()* 4) * 90).toString())}
        else {this.rect.transform('s1,' + (Math.random() < 0.5 ? -1 : 1).toString())};
      }
      if (Math.random() > 0.3) {
        this.rect.attr({ fill: colors[randomNumber(colors)] });
      }
    }

    this.show = function() {
      this.rect = _s.rect(this.x,this.y,this.maxX - this.x,this.maxY - this.y).attr({
        mask: (this.isSquare) ?
                _s.image("svg/" + assignMask(squareMasks,true) + ".svg",this.x,this.y,this.maxX - this.x,this.maxY - this.y) :
                (this.longRect) ?
                _s.image("svg/link-3.svg",this.x,this.y,this.maxX - this.x,this.maxY - this.y) :
                _s.image("svg/" + assignMask(rectMasks,false) +".svg",this.x,this.y,this.maxX - this.x,this.maxY - this.y),
                fill: colors[randomNumber(colors)] });
    };

  }

  function assignMask(maskArray,isSquare) {
    var mask;
    mask = maskArray[randomNumber(maskArray)];
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
