//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


// FETF items individual pages START
const _ = require('underscore')
const { getData } = require('../app/data')
const data = getData()

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

router.get('/fetf/application/v1-0/items/equipment-list', (req, res) => {
    const sortedData = _.sortBy(data, 'principleTitle')
    const groupedData = _.groupBy(sortedData, 'sectionNumber')
    const allData = _.sortBy(data, 'sectionNumber')
    // console.log(groupedData)
    res.render('fetf/application/v1-0/items/equipment-list.html', { groupedData, sortedData, allData });
})



// router.get('/:principleTitle', (req, res) => {
//     const { principleTitle } = req.params
//     const item = _.findWhere(data, {principleTitle: capitalizeFirstLetter(principleTitle.replace('-', ' '))})
//     res.render('principle.html', { item });
// })

router.get('/fetf/application/v1-0/items/:termName', (req, res) => {
    const { termName } = req.params
    const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
    res.render('fetf/application/v1-0/items/equipment.html', { item })
})

router.get('/fetf/application/v1-0/item-quantity/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/application/v1-0/item-quantity.html', { item })
})

router.get('/fetf/application/v1-0/item-quantity/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/application/v1-0/item-quantity.html', { item })
})



// FETF items individual pages END



// FETF items filters START

router.post('/fetf/application/v1-0/items/equipment-list/apply-filters', (req, res) => {
  if (req.session.data.clearFilters == "true") {
    req.session.data.section = ""
    req.session.data.role = ""
    req.session.data.disciplines = ""
    req.session.data.filteredResults = ""
    req.session.data.clearFilters = ""
  } else {

  console.log('success test')
  
  const allData = _.sortBy(data, 'sectionNumber')
  console.log(data.length)
  // console.log(allData)

  // let filteredResults = ''
  // console.log(filteredResults)

//filters
let categoryFilter = req.session.data.category

//set global scope of filtered results
let filteredResults = [];

//loop through each of the objects
for (i of allData) {
  // console.log(i.disciplines);
  //if the object contains a matching value from the filter then add it to the filtered results array

  if (typeof categoryFilter === 'undefined') {
    categoryFilter= ""
 }  
  if (i.category.some((value) => categoryFilter.includes(value))) {
    filteredResults.push(i);
  }
}

console.log(categoryFilter);
  
  req.session.data.filteredResults = filteredResults
  
}
  res.redirect('/fetf/application/v1-0/items/equipment-list') 
})

// FETF items filters END



// FETF journey branching START


// FETF item selection

router.post('/fetf-items-selection', function(request, response) {
  response.redirect("/fetf/application/v1-0/item-quantity")
})


// FETF item quantity

router.post('/fetf-add-to-selected-items', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/application/v1-0/selected-items")
})


// FETF claims summary

router.post('/fetf-add-to-selected-items-claims', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/_includes/body-content_claim-detail-main-block")
})


// FETF item summary

router.post('/selected-items-summary', function(request, response) {
  response.redirect("/fetf/application/v1-0/select-items-complete")
})


// FETF items section complete question (not used, bring it back if we want to include the 'Have you completed this section' question)

router.post('/fetf-items-complete', function(request, response) {
  var sectionComplete = request.session.data['haveYouCompletedThisSection']
  if (sectionComplete == "yes"){
      response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02b&fetf-agree=01&fetf-claim=01")
  } else {
      response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02a&fetf-agree=01&fetf-claim=01")
  }
})






// FETF items business address question

router.post('/fetf/fetf-items-business-address', function(request, response) {
  var aboutBusinessLocation = request.session.data['stored-business-address']
  if (aboutBusinessLocation == "Yes"){
      response.redirect("/fetf/application/v1-0/about-items/equipment-contracting")
  } else {
      response.redirect("/fetf/application/v1-0/about-items/equipment-location-details")
  }
})






// FETF items other locations

router.post('/fetf-items-other-locations', function(request, response) {
  response.redirect("/fetf/application/v1-0/about-items/equipment-contracting")
})


// FETF items contracting question

router.post('/fetf/fetf-items-contracting', function(req, res) {
  var aboutContracting = req.session.data['for-contracting']
  if (aboutContracting == "Yes"){
      res.redirect("/fetf/application/v1-0/about-items/equipment-contractor-details")
  } else {
      res.redirect("/fetf/application/v1-0/about-items/livestock-information")
  }
})





// FETF items contracting other question

router.post('/fetf-contractor-details', function(request, response) {
  response.redirect("/fetf/application/v1-0/about-items/livestock-information")
})


// FETF items contracting other question

router.post('/fetf-livestock-information', function(request, response) {
  response.redirect("/fetf/application/v1-0/about-items/equipment-summary")
})


// FETF items summary

router.post('/fetf-items-summary', function(request, response) {
  response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02d&fetf-agree=01&fetf-claim=01")
})






// FETF farm assurance schemes

router.post('/fetf-assurance-schemes', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/livestock-schemes")
})


// FETF livestock health schemes

router.post('/fetf-livestock-schemes', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/check-your-details")
})


// FETF check business details

router.post('/fetf-check-business-details', function(request, response) {
  response.redirect("/fetf/activity-list/v2-0/?fetf-status=01b&fetf-apply=02a&fetf-agree=01&fetf-claim=01")
})

// FETF submit application

router.post('/fetf-submit-application', function(request, response) {
  response.redirect("/fetf/application/v1-0/submit-application/confirmation")
})


// FETF journey branching END

module.exports = router

// Claims item details


router.get('/fetf/claim/v1-0/claim-item-details2/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('/fetf/claim/v1-0/claim-item-detail2.html', { item })
})





// FETF item quantity livestock

router.post('/fetf-add-to-selected-items-livestock', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/application/v1-0/selected-items-livestock")
})



// Added for livestock questions (test)
router.get('/fetf/application/v1-0/livestock-information/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/application/v1-0/livestock-information.html', { item })
})


// FETF business structure

router.post('/fetf-business-structure', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/land-details")
})





// FETF business structure

router.post('/fetf-land-details', function(request, response) {
  response.redirect("/fetf/application/v1-0/business-details/farm-assurance")
})



//Claim task status

router.post('/fetf/set-status', function(request, response) {
  var termName = request.body['termName']
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      selectedItem.status = "Completed"
    }
  }
  
  response.redirect("/fetf/claim/v1-0/upload")
})



//Feedback fetf

router.post('/fetf/feedback-question', function(req, res) {

  var giveFeedback = req.session.data['give-feedback']


  if (giveFeedback == "true"){

    res.redirect('/fetf/feedback-submit')
  } else {
    res.redirect('/fetf/help')
  }

})

//Feedback ftf

router.post('/ftf/feedback-question', function(req, res) {
  var giveFeedback = req.session.data['give-feedback']

  if (giveFeedback == "true"){
    res.redirect('/ftf/feedback-submit')
  } else {
    res.redirect('/ftf/help')
  }

})



// FTF help triage

router.post('/ftf-help-triage', function(request, response) {
  var helpTriage = request.session.data['whatDoYouNeedHelpWith']

  if (helpTriage == "request a change to my Grant Funding Agreement"){
    response.redirect('/ftf/change-request/select-reason')
  } else {
    response.redirect('/_common/not-testing')
  }
  
  
})


// FTF select reason

router.post('/ftf-select-reason', function(request, response) {
  response.redirect('/ftf/change-request/describe-reason')
})

// FTF describe reason

router.post('/ftf-describe-reason', function(request, response) {
  response.redirect('/ftf/change-request/check-answers')
})




// FETF help triage

router.post('/fetf-help-triage', function(request, response) {
  var helpTriage = request.session.data['whatDoYouNeedHelpWithFetf']

  if (helpTriage == "request a change to my Grant Funding Agreement"){
    response.redirect('/fetf/change-request/select-reason')
  } else {
    response.redirect('/_common/not-testing')
  }
  
  
})


// FETF select reason




router.post('/fetf-select-reason', function(request, response) {
  var changeType = request.session.data['whatDoYouWantToChangeFetf']

  if (changeType == "change to claim date"){
    response.redirect('/fetf/change-request/claim-date')
  } 
  else if (changeType == "change to items"){
    response.redirect('/fetf/change-request/selected-items')
  } 
  else {
    response.redirect('/fetf/change-request/another-change')
  }
  
  
})

// FETF describe reason

router.post('/fetf-describe-reason', function(request, response) {
  response.redirect('/fetf/change-request/another-change')
})

// FETF claim date

router.post('/claim-date-change', function(request, response) {
  response.redirect('/fetf/change-request/another-change')
})

// FETF make another change?



router.post('/fetf-another-change', function(request, response) {
  var otherChange = request.session.data['anotherChange']

  if (otherChange == "yes"){
    response.redirect('/fetf/change-request/select-reason.html')
  } 
  
  else {
    response.redirect('/fetf/change-request/check-answers')
  }
  
  
})





// FETF Change request  equipment list

router.get('/fetf/change-request/equipment-list', (req, res) => {
  const sortedData = _.sortBy(data, 'principleTitle')
  const groupedData = _.groupBy(sortedData, 'sectionNumber')
  const allData = _.sortBy(data, 'sectionNumber')
  res.render('fetf/change-request/equipment-list.html', { groupedData, sortedData, allData });
})


router.get('/fetf/change-request/equipment/:termName', (req, res) => {
  const { termName } = req.params
  const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
  res.render('fetf/change-request/equipment.html', { item })
})




router.get('/fetf/change-request/item-quantity/:termName', (req, res) => {
const { termName } = req.params
const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
res.render('fetf/change-request/item-quantity.html', { item })
})


// FETF claim date

// router.post('/fetf-add-to-changed-items', function(request, response) {
//   response.redirect('/fetf/change-request/selected-items')
// })



// FETF add item to change request

router.post('/fetf-add-to-changed-items', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity += quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/change-request/selected-items")
})

// new routes to spin off

router.get('/selectBusinessAddress1', function (req, res) {
  if (req.session.data.nameNo1 !== '') {
    res.redirect('/fetf/rewrite/check-details/confirm-business-address');
    }
  else 
    res.redirect('/fetf/rewrite/check-details/select-business-address');
});

router.get('/selectAgentAddress1', function (req, res) {
  if (req.session.data.aNameNo !== '') {
    res.redirect('/fetf/rewrite/check-details/confirm-agent-address');
    }
  else 
    res.redirect('/fetf/rewrite/check-details/select-agent-address');
});

router.get('/agentApplies', function (req, res) {
  req.session.data.agent = 'Yes';
  res.redirect('/fetf/rewrite/how-to-apply-for-a-farming-equipment-and-technology-fund-fetf-2024-grant');
});

router.get('/farmerApplies', function (req, res) {
  req.session.data.agent = 'No';
  res.redirect('/fetf/rewrite/how-to-apply-for-a-farming-equipment-and-technology-fund-fetf-2024-grant');
});

router.get('/dataSetPrepop1', function (req, res) {

  req.session.data.agentName = 'Sally Wiston';
  req.session.data.agentEmail = 'sally.wiston@wistonlandagents.co.uk';
  req.session.data.agentNumber = '01273 333000';
  req.session.data.aBusName = 'Wiston Land Agents Ltd';
  req.session.data.aNameNo = '1';
  req.session.data.aPostcode = 'RH11 3RA';

  req.session.data.busName = 'Plumpton Farm Ltd';
  req.session.data.bNumber = '01674775345';
  req.session.data.sbi = '272727276';
  req.session.data.vatNo = 'GB123456789';
  req.session.data.chNumber = '09876543';
  req.session.data.cIncNo = '01234567';
  req.session.data.legalStatus = 'Limited company';
  req.session.data.nameNo1 = 'North Farmstead';
  req.session.data.postcode1 = 'BN5 93B';

  req.session.data.yourName = 'Christopher Hart';
  req.session.data.email = 'plumpton.farm@me.com';
  req.session.data.mNumber = '07701234567';
  req.session.data.lNumber = '01273726304';

  req.session.data.structure = 'Landowner';
  req.session.data.employeesNumber = '12';
  req.session.data.agricultureHectares = '22';
  req.session.data.horticultureHectares = '5';
  req.session.data.forestryHectares = '';
  req.session.data.assuranceScheme = 'Red Tractor';
  req.session.data.animals = 'Yes';
  req.session.data.animalsNo = '10000';
  req.session.data.accountNumber1 = '11';
  req.session.data.accountNumber2 = '453';
  req.session.data.accountNumber3 = '8787';
  req.session.data.livestockSchemes = 'Laid in Britain'; 
  req.session.data.useLand = 'Agriculture'; 

  res.redirect('/fetf/rewrite/service-start');
  
}); 

// FETF check business details

router.post('/fetf-check-business-details1', function(request, response) {
  response.redirect("/fetf/rewrite/task-list?fetf-status=01b&fetf-apply=02a&fetf-agree=01&fetf-claim=01")
})

router.get('/checkTaskComplete1', function (req, res) {

  req.session.data.checkComplete = 'Yes';
  res.redirect('/fetf/rewrite/task-list');

});


// changed FETF item filtering


router.post('/searchFindItems1', function(req, res) {
  if (req.session.data.searchFind === 'Yes'){
      const sortedData = _.sortBy(data, 'principleTitle')
      const groupedData = _.groupBy(sortedData, 'sectionNumber')
      const allData = _.sortBy(data, 'sectionNumber')
      // console.log(allData)

      res.render('/fetf/rewrite/select-items/item-search', { groupedData, sortedData, allData });
  } else {
      res.redirect("/fetf/rewrite/select-items/which-item-types")
  }
})

router.post('/equipmentListApplyFilters', (req, res) => {
  if (req.session.data.clearFilters == "true") {
    req.session.data.section = ""
    req.session.data.role = ""
    req.session.data.disciplines = ""
    req.session.data.filteredResults = ""
    req.session.data.clearFilters = ""
  } else {

  console.log('success test')
  
  const allData = _.sortBy(data, 'sectionNumber')
  console.log(data.length)
  // console.log(allData)

  // let filteredResults = ''
  // console.log(filteredResults)

//filters
let categoryFilter = req.session.data.category

//set global scope of filtered results
let filteredResults = [];

//loop through each of the objects
for (i of allData) {
  // console.log(i.disciplines);
  //if the object contains a matching value from the filter then add it to the filtered results array

  if (typeof categoryFilter === 'undefined') {
    categoryFilter= ""
 }  
  if (i.category.some((value) => categoryFilter.includes(value))) {
    filteredResults.push(i);
  }
}

console.log(categoryFilter);
  
  req.session.data.filteredResults = filteredResults
  
}
  res.redirect('/fetf/rewrite/select-items/equipment-list') 
})


router.get('/fetf/rewrite/select-items/items/:termName', (req, res) => {
    const { termName } = req.params
    const item = _.findWhere(data, {termName: capitalizeFirstLetter(termName.replace('-', ' '))})
    res.render('fetf/rewrite/select-items/equipment.html', { item })
    console.log(item)
    console.log(termName)
})



router.post('/fetf-add-to-selected-items1', function(request, response) {
  var quantity = Number(request.body['quantity'])
  var termName = request.body['termName']
  var itemExists = false
  console.log(quantity)
  console.log(termName)
  for (var selectedItem of request.session.data['selected-items']){
    if (selectedItem.termName == termName) {
      itemExists = true
      selectedItem.quantity = quantity
      selectedItem.grantTotal = Number(selectedItem.quantity) * Number(selectedItem.grantValue.replace(',',''))
    }
  }
  if (itemExists == false){
    const item = _.findWhere(data, {termName: termName})
    item.quantity = quantity
    item.grantTotal = Number(item.quantity) * Number(item.grantValue.replace(',',''))
    request.session.data['selected-items'].push(item)
  }
  
  response.redirect("/fetf/rewrite/select-items/selected-items")
})

router.get('/moreItems1', function (req, res) {

  if (req.session.data.addAnother === 'Yes') {
    res.redirect('/fetf/rewrite/select-items/item-search-or-list');
    }
  else 
    if (req.session.data.grantTotal > 25000){
      req.session.data.uploadFin = 'Yes';
    }
    req.session.data.selectComplete = 'Yes';
    res.redirect('/fetf/rewrite/task-list');

});

router.get('/removeItems1/:itemCode', (req, res) => {
  const { itemCode } = req.params;
  var selectedItems = req.session.data['selected-items'];
  console.log(selectedItems);
  selectedItems = selectedItems.filter(item => item.itemCode !== itemCode);
  req.session.data['selected-items'] = selectedItems;
  if (req.session.data['selected-items'].length)
    res.redirect("/fetf/rewrite/select-items/selected-items");
  else 
    res.redirect("/fetf/rewrite/select-items/item-search-or-list");
})

router.post('/itemSearch1', (req, res) => {
  if (req.session.data.clearFilters == "true") {
    req.session.data.section = ""
    req.session.data.role = ""
    req.session.data.disciplines = ""
    req.session.data.filteredResults = ""
    req.session.data.clearFilters = ""
  } else {

  console.log('success test')
  
  const allData = _.sortBy(data, 'sectionNumber')
  console.log(data.length)
  // console.log(allData)

  // let filteredResults = ''
  // console.log(filteredResults)

//filters
let itemNumber = req.session.data.fetfNo

//set global scope of filtered results
let filteredResults = [];

//loop through each of the objects
for (i of allData) {
  // console.log(i.disciplines);
  //if the object contains a matching value from the filter then add it to the filtered results array

  if (typeof itemNumber === 'undefined') {
    itemNumber= ""
 }  
     console.log(itemNumber)
    console.log(i.itemCode)
  if (i.itemCode === itemNumber) {
    filteredResults.push(i);
  }
}

console.log(filteredResults);
  
  req.session.data.filteredResults = filteredResults
  
}
  res.redirect('/fetf/rewrite/select-items/equipment-list') 
})


// About FETF items


router.get('/aboutComplete1', function (req, res) {

  req.session.data.aboutItemsComplete = 'Yes';
  res.redirect('/fetf/rewrite/task-list');

});

// Finanacial details


router.get('/finComplete1', function (req, res) {

  req.session.data.evComplete = 'Yes';
  res.redirect('/fetf/rewrite/task-list');

});






// FETF items filters END

 


router.post('/fetf/fetf-items-business-address1', function(request, response) {
  var aboutBusinessLocation = request.session.data['stored-business-address']
  if (aboutBusinessLocation == "Yes"){
      response.redirect("/fetf/rewrite/about-items/equipment-contracting")
  } else {
      response.redirect("/fetf/rewrite/about-items/equipment-location-details")
  }
})

router.post('/fetf/fetf-items-contracting1', function(req, res) {
  if (req.session.data.forContracting === 'Yes'){
      res.redirect("/fetf/rewrite/about-items/equipment-contractor-details")
  } else {
      res.redirect("/fetf/rewrite/about-items/equipment-summary")
  }
})






// FETF grassland upload triage (not in use)

router.post('/fetf/claim/v1-1/grassland-invoice-answer', function(request, response) {
  var grasslandUploadReuse = request.session.data['grasslandUpload']

  if (grasslandUploadReuse == "reuse"){
    response.redirect('/fetf/claim/v1-1/grassland-upload-reuse')
  } else {
    response.redirect('/fetf/claim/v1-1/grassland-invoice-files')
  }
  
  
})


// FETF invoice-1 add another triage

router.post('/fetf/claim/v1-1/invoice/invoice1-answer', function(request, response) {
  var invoiceAddAnother = request.session.data['invoice1Add']

  if (invoiceAddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/invoice/invoice-2')
  } else {
    response.redirect('/fetf/claim/v1-1/invoice/check-answers-invoice')
  }
  
  
})


// FETF bank statement upload1 add another triage

router.post('/fetf/claim/v1-1/statement/upload1-answer', function(request, response) {
  var statement1AddAnother = request.session.data['statement1Add']

  if (statement1AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/statement/upload2')
  } else {
    response.redirect('/fetf/claim/v1-1/statement/check-answers')
  }
  
  
})


// FETF bank statement upload2 add another triage

router.post('/fetf/claim/v1-1/statement/upload2-answer', function(request, response) {
  var statement2AddAnother = request.session.data['statement2Add']

  if (statement2AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/statement/upload3')
  } else {
    response.redirect('/fetf/claim/v1-1/statement/check-answers')
  }
  
  
})


// FETF photo upload1 add another triage

router.post('/fetf/claim/v1-1/photos/upload1-answer', function(request, response) {
  var photo1AddAnother = request.session.data['photo1Add']

  if (photo1AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/photos/upload2')
  } else {
    response.redirect('/fetf/claim/v1-1/photos/check-answers')
  }
  
  
})

// FETF photo upload2 add another triage

router.post('/fetf/claim/v1-1/photos/upload2-answer', function(request, response) {
  var photo2AddAnother = request.session.data['photo2Add']

  if (photo2AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/photos/upload3')
  } else {
    response.redirect('/fetf/claim/v1-1/photos/check-answers')
  }
  
  
})

// FETF photo upload3 add another triage

router.post('/fetf/claim/v1-1/photos/upload3-answer', function(request, response) {
  var photo3AddAnother = request.session.data['photo3Add']

  if (photo3AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/photos/upload4')
  } else {
    response.redirect('/fetf/claim/v1-1/photos/check-answers')
  }
  
  
})

// FETF photo upload4 add another triage

router.post('/fetf/claim/v1-1/photos/upload4-answer', function(request, response) {
  var photo4AddAnother = request.session.data['photo4Add']

  if (photo4AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/photos/upload5')
  } else {
    response.redirect('/fetf/claim/v1-1/photos/check-answers')
  }
  
  
})


// FETF photo upload5 add another triage

router.post('/fetf/claim/v1-1/photos/upload5-answer', function(request, response) {
  var photo5AddAnother = request.session.data['photo5Add']

  if (photo5AddAnother == "yes"){
    response.redirect('/fetf/claim/v1-1/photos/upload6')
  } else {
    response.redirect('/fetf/claim/v1-1/photos/check-answers')
  }
  
  
})


// FETF v1-2 invoice for item 2 triage

router.post('/fetf/claim/v1-2/item2/invoice-answer', function(request, response) {
  var item2Invoice = request.session.data['item2InvoiceMethod']

  if (item2Invoice == "yes"){
    response.redirect('/fetf/claim/v1-2/item2/previous-invoices')
  } else {
    response.redirect('/fetf/claim/v1-2/item2/invoice')
  }
  
  
})

// FETF v1-2 invoice check triage

router.post('/fetf/claim/v1-1/item2/check-invoice-answer', function(request, response) {
  var item2InvoiceCheck = request.session.data['item2InvoiceCheck']

  if (item2InvoiceCheck == "yes"){
    response.redirect('/fetf/claim/v1-2/item2/invoice-file-added')
  } else {
    response.redirect('/fetf/claim/v1-2/item2/upload-method-serial')
  }
  
  
})


// FETF v1-2 statement for item 2 triage

router.post('/fetf/claim/v1-2/item2/statement-answer', function(request, response) {
  var item2Statement = request.session.data['item2StatementMethod']

  if (item2Statement == "yes"){
    response.redirect('/fetf/claim/v1-2/item2/previous-statements')
  } else {
    response.redirect('/fetf/claim/v1-2/item2/statement')
  }
  
  
})



// FETF v1-2 statement - check if the second one if correct

router.post('/fetf/claim/v1-1/item2/check-statement2-answer', function(request, response) {
  var item2Statement2 = request.session.data['item2Statement2']

  if (item2Statement2 == "yes"){
    response.redirect('/fetf/claim/v1-2/item2/check-statement2')
  } else {
    response.redirect('/fetf/claim/v1-2/item2/upload-method-statement')
  }
  
  
})



