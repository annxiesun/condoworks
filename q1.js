// since one space seperates words while multiple spaces seperate different chunks of information
//    and the number of spaces is unknown, I chose to split by 5 as no chunks are seperated by
//    anything smaller
function split_5spaces(line) {
  var new_line = []
  var last_in = 0;
  var spaces = 0;
  for (let i = 0; i < line.length; i++) {
    if (spaces > 5 && line[i] != ' ') {
      new_line.push(line.substring(last_in, i).trim())
      spaces = 0;
      last_in = i;
    }
    if (line[i] == ' ') {
      spaces += 1
    }
  }
  return new_line;
}

function get_info(lines) {
  var bill = {
    id_numbers: null,
    period: null,
    date: null,
    num: null,
    new_charges: null
  }

  var id_numbers = file_lines[10].split("-")

  for (let i = 0; i < id_numbers.length; i++) {
    id_numbers[i] = id_numbers[i].toString().trim();
  }

  bill.id_numbers = id_numbers

  var line_15 = split_5spaces(file_lines[15])

  bill.period = (line_15[1].substring(0, line_15[1].length - 1))

  bill.date = file_lines[11].split(":")[1].trim()
  bill.num = file_lines[12].split(":")[1].trim()

  bill.new_charges = split_5spaces(file_lines[30])[1]

  return bill;

}

function print_info(bill) {
  console.log("Customer number: " + bill.id_numbers[0] + " --- " + "Account number: " + bill.id_numbers[1])
  console.log("Billing period: " + bill.period);
  console.log("Bill date: " + bill.date);
  console.log("Bill number: " + bill.num);
  console.log("New Charges: " + bill.new_charges);
}

var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString(); // change file name here
var file_lines = input.split("\n")

var water_bill = get_info(file_lines);
print_info(water_bill);