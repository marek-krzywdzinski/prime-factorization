// Proof of Concept, goals: Keep It Simple, prepare for unlimited parallel execution
var express = require('express'),
  morgan = require('morgan'),
  bigInt = require("big-integer"),
  os = require("os"),
  fs = require("fs"),
  μs = require('microseconds'),
  app = express();

var semiprime = function(request_parameters) {
  var attempt = [os.tmpdir(), "prime-factorization"];
  if (fs.existsSync(attempt.join("\\")) == false) {
    fs.mkdirSync(attempt.join("\\"));
  }
  this.value = bigInt(request_parameters["semiprime"]);
  //implement square root for bigInt
  this.rounded_square_root = bigInt(undefined);
  //Math.round(Math.sqrt(this.value));
  if (bigInt(this.rounded_square_root).square() > this.value) {
    this.rounded_square_root = this.rounded_square_root.subtract(1);
  }
  //compute dimension for any number
  this.dimension = bigInt(undefined);
  this.result;
  this.key = request_parameters["key"];
};

semiprime.prototype.getValue = function() {
	return this.value;
};

semiprime.prototype.getRoundedSquare = function() {
  return this.rounded_square_root;
};

semiprime.prototype.isResultKnown = function() {
	return this.result !== undefined;
};

semiprime.prototype.findPrimes = function(elapsed_time) {
  h = bigInt(0);
  while (this.isResultKnown() == false) {
    h = h.add(1);
    limit = bigInt(this.dimension).pow(this.dimension);
    console.log(h + ", " + limit.subtract(h));
    var i = bigInt(0);
    var attempt = [os.tmpdir(), "prime-factorization"];
    if (this.key === "all") {
      for (j = 2; j <= (1 + this.dimension); j++) {
        attempt.push(bigInt(bigInt.randBetween(0, this.dimension - 1)));
        i = i.add(attempt[j].multiply(this.dimension.pow(j - 2)));
      }
    } else {
      attempt.push(bigInt(this.key));
      for (j = 2; j <= (1 + this.dimension); j++) {
        if (this.key != j - 2) {
          attempt.push(bigInt(getRandomInteger(0, this.dimension - 1)));
        };
        i = i.add(attempt[j].multiply(this.dimension.pow(j - 2)));
      }
    }
    if (fs.existsSync(attempt.join("\\")) == false) {
      if ((i.lesserOrEquals(this.rounded_square_root)) && (i.greaterOrEquals(2)))
      {
        if (this.value.mod(i).equals(0)) {
          this.result = this.value + " = " + i + " x " + this.value.divide(i) + " (" + elapsed_time + " μs)";
        };
      }
    }
    var temporary = [os.tmpdir(), "prime-factorization"];
    for (l = 1; l <= attempt.length; l++) {
      temporary = attempt.slice(0, l);
      if (fs.existsSync(temporary.join("\\")) == false) {
        fs.mkdirSync(temporary.join("\\"));
      };
    }
  }
  console.log(attempt);
  console.log(this.result);
  return this.result;
};

app.use(morgan('combined'));

app.get("/find_primes/:semiprime/:key", function(req, res) {
  var before = μs.now();
	my_semiprime = new semiprime(req.params);
	var elapsed_time = Math.round(time = μs.since(before));
  res.send(my_semiprime.findPrimes(elapsed_time));
});

app.listen(8080, function() {
});
