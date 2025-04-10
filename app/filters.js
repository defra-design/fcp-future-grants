//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
// arb change

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

var filters = {}

;(filters.commafy = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}),
  (filters.toFixed = function (num, digits) {
    return parseFloat(num).toFixed(digits).replace(/\.00$/, '')
  }),
  (filters.joinArray = function (array) {
    if (!array || array.length === 0) {
      return ''
    }
    return array.join(', ')
  })

// Add filter that takes an optional array of items and a value to check if the value is in the array
filters.isIn = function (value, array) {
  if (!array || array.length === 0) {
    return false
  }
  return array.includes(value)
}

filters.redirect = function (url) {
  return '<script> window.location.href ="' + url + '";</script>'
}

addFilter('inPounds', (input) => {
  const num = Number(input)
  if (isNaN(num)) {
    return '£XX.XX'
  }
  if (num >= 1000000 && num < 1000000000 && num % 10000 === 0) {
    let millionValue = (num / 1000000).toFixed(2)
    // Remove trailing zeros after decimal point
    millionValue = parseFloat(millionValue).toString()
    return `£${millionValue} million`
  }
  var returnStr =
    '£' +
    num.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  returnStr = returnStr.replace(/\.00$/, '')
  return returnStr
})

addFilter('formatNumber', (input) => {
  const num = Number(input)
  if (isNaN(num)) {
    return 'XX'
  }
  return num.toLocaleString('en-GB')
})

addFilter('checkboxAnswersToList', (input, fallback = '') => {
  var returnStr = '<ul class="govuk-list govuk-list--bullet">'
  if (input) {
    if (Array.isArray(input)) {
      if (input.length) {
        input.forEach((element) => {
          returnStr += '<li>' + element + '</li>'
        })
      } else if (fallback) {
        returnStr += '<li>' + fallback + '</li>'
      }
    } else {
      if (fallback) {
        returnStr += '<li>' + fallback + '</li>'
      } else {
        returnStr += '<li>' + input + '</li>'
      }
    }
  } else {
    returnStr += '<li>' + input + '</li>'
  }
  return returnStr + '</ul>'
})

addFilter('toNumber', (currencyStr) => {
  if (typeof currencyStr !== 'string') {
  throw new Error('Input must be a string');
  }
  // Remove commas from the string
  const cleanedStr = currencyStr.replace(/,/g, '');
  // Convert the cleaned string to a number
  const number = parseFloat(cleanedStr);
  return number;
})



addFilter('percent', (input, percentage) => {
  return Number(input) * (Number(percentage) / 100)
})

// lowerCase, upperCase, sentenceCase, titleCase
addFilter('lowerCase', (input) => {
  return input.toLowerCase()
})
addFilter('upperCase', (input) => {
  return input.toUpperCase()
})
addFilter('sentenceCase', (input) => {
  return input.charAt(0).toUpperCase() + input.slice(1)
})
addFilter('titleCase', (input) => {
  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

// Add the filters using the addFilter function
Object.entries(filters).forEach(([name, fn]) => addFilter(name, fn))