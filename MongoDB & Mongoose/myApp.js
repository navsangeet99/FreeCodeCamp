require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const Schema = mongoose.Schema;

//create person schema with prototype
const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

//create model
const Person = mongoose.model("Person", personSchema);

//create an item and save it in db, dime shah is a person
const createAndSavePerson = (done) => {
  var dimeShah = new Person({name: "Dime Shah", age: 1, favoriteFoods: ["eggs", "fish", "beef"]});
  //save and use success and wrror ahndling
  dimeShah.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

//create many records using model.create
var arrayOfPeople=[{name: 'Dime', age: 1, favoriteFoods: ['eggs', 'fish', 'beef']}, {name: 'Vish', age: 20, favoriteFoods: ['chicken', 'goat', 'fish']}, {name: 'Jasvir', age: 52, favoriteFoods: ['cheese', 'veggies', 'potato salad']}];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people){
    if(err) return console.log(err);
    done(null, people);
  });
};

//find all people having given name
const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function (err, personFound){
    if(err) return console.log(err);
    done(null, personFound);
  });
};

//find a person using their favorite food as search key
const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function (err, data){
    if(err) return console.log(err);
    done(null, data);
  });
};

//find a person by its id, even though the person isnt given id by us, mongodb automatically gives every argument a unique id
const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, data){
    if(err) return console.log(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  // .findById() method to find a person by _id with the parameter personId as search key.
  Person.findById(personId, (err, person) => {
    if(err) return console.log(err);

    // Array.push() method to add "hamburger" to the list of the person's favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // and inside the find callback - save() the updated Person.
    person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};

//find a person by using name as search key and then change the age to the given and update the document with new changes
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

// new:true should be used to update doc with new changes
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedDoc)=> {
    if (err) return console.log(err);
      done(null, updatedDoc);

  })

};

//find a person using id as a search key and remove the person from the document and update the update the document
const removeById = (personId, done) => {

  Person.findByIdAndRemove(personId, (err, removedDoc)=>{
    if (err) return console.log(err);
    done(null, removedDoc);
  })

};

//remove person with name given and the remove many people function doesn't return the document but the response and goes into the callback
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

Person.remove({name: nameToRemove}, (err, response)=>{
  if (err) return console.log(err);
    done(null, response);
})

};

//find a food given and sort the people by name in asc and age shoukd be hidden, selevct just 2 documents and callback should be in exec
const queryChain = (done) => {
  var foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch}).sort({name : "asc"}).limit(2).select({age: 0}).exec((err, data) => {
     if(err)
       done(err);
    done(null, data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
