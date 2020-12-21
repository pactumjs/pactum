# Matching

In real world applications, sometimes it is hard to match an expected request/response with actual request/response. To overcome such issues, **pactum** provides a mechanism for request & response matching.

## Table of Contents

* [Supported Matchers](#supported-matchers)
* [Type Matching](#type-matching)
  * [like](#like)
  * [eachLike](#eachLike)
* [Regex Matching](#regex-matching)
  * [regex](#regex)

## Supported Matchers

It supports following matchers

* `like` - matches with the type
* `eachLike` - matches all the elements in the array with the specified type
* `regex` - matches with the regular expression
* `includes` - checks if actual value includes a specified value in it
* `oneOf` - checks if actual value is one of the expected value
* `expression` - checks if actual value is satisfies the expected expression

Matchers are applied on JSON
  
* during response validation - [expectJsonMatch](api-testing#expectJsonMatch)
* during request matching for interactions in [Mock Server](mock-server)
* during request and response matching for [Contract Testing](contract-testing)

## Type Matching

Often, you will not care what the exact value is at a particular path is, you just care that a value is present and that it is of the expected type.

* `like`
* `eachLike`

### like

Type matching for primitive data types - *string*/*number*/*boolean*

#### Type Matching single property in a JSON

```javascript
const { like } = require('pactum').matchers;

// matches if it is a JSON object
// & it has 'id' & 'name' properties 
// & where 'id' is of 'number' type & 'name' equal to 'jon'
const actual = {
  id: like(1),
  name: 'jon'
}

// actual === exp1 -> True
const exp1 = {
  id: 100987,
  name: 'jon'
}

// actual === exp2 -> True
const exp2 = {
  id: 100987,
  name: 'jon',
  active: true
}

// actual === exp3 -> False
const exp3 = {
  id: "C17",
  name: 'jon'
}
```

#### Type Matching whole JSON

```javascript
const { like } = require('pactum').matchers;

// matches if it is a JSON object
// & it has 'id' & 'name' properties 
// & where 'id' is of 'number' type & 'name' is of 'string' type
const actual = like({
  id: 1,
  name: 'jon'
})

// actual === exp1 -> True
const exp1 = {
  id: 100987,
  name: 'snow'
}

// actual === exp2 -> False
const exp2 = {
  id: 'C17',
  name: 'jon'
}
```

#### Type Matching Nested Objects in JSON

```javascript
const { like } = require('pactum').matchers;

// matches if it is a JSON object
// & it has quantity, active & item properties 
// & with number, bool & object types respectively
// & item has name & brand properties with 'car' & 'v40' values respectively
const actual = like({
  quantity: 2,
  active: true,
  item: {
    name: 'car',
    brand: 'v40'
  }
});

// actual === exp1 -> True
const exp1 = {
  quantity: 1,
  active: false,
  item: {
    name: 'car',
    brand: 'v40'
  }
}

// actual === exp2 -> False
const exp2 = {
  quantity: 1,
  active: false,
  item: {
    name: 'bus',
    brand: 'v40'
  }
}
```

To match nested objects with type, we need apply `like()` explicitly to nested objects

```javascript
const { like } = require('pactum').matchers;

// matches if it is a JSON object
// & it has quantity, active & item properties 
// & with number, bool & object types respectively
// & item has name & brand properties with string types
const actual = like({
  quantity: 2,
  active: true,
  item: like({
    name: 'car',
    brand: 'v40'
  })
});

// actual === exp1 -> True
const exp1 = {
  quantity: 1,
  active: false,
  item: {
    name: 'car',
    brand: 'v40'
  }
}

// actual === exp2 -> True
const exp2 = {
  quantity: 1,
  active: false,
  item: {
    name: 'bus',
    brand: 'v40'
  }
}

// actual === exp3 -> False
const exp3 = {
  quantity: 1,
  active: false,
  item: {
    name: 'bus'
  }
}
```

### eachLike

*eachLike* is similar to *like* but applies to arrays.

```javascript
const { eachLike } = require('pactum-matchers');

// matches if it is an array 
// & each item in the array is an object
// & each object should have quantity, active, product properties
// & quantity, active, product should be of types number, boolean & object
// & product has a name property with string type
// & product has a colors property with array of strings
const actual = eachLike({
  quantity: 2,
  active: true,
  product: like({
    name: 'car',
    colors: eachLike('blue')
  })
});

// actual === exp1 -> True
const exp1 = [
  {
    quantity: 1,
    active: false,
    product: {
      name: 'car',
      colors: [ 'red' ]
    }
  },
  {
    quantity: 10,
    active: true,
    product: {
      name: 'bus',
      colors: [ 'red', 'black' ]
    }
  }
];

// actual === exp2 -> False
const exp2 = [
  {
    quantity: 1,
    active: false,
    product: {
      name: 'car',
      colors: []
    }
  },
  {
    quantity: 10,
    active: true,
    product: {
      name: 'bus',
      colors: [ 1, 2 ]
    }
  }
];
```

## Regex Matching

Sometimes you will have keys in a request or response with values that are hard to know beforehand - timestamps and generated IDs are two examples.

What you need is a way to say "I expect something matching this regular expression, but I don't care what the actual value is".

### regex

```javascript
const { regex } = require('pactum-matchers');
const actual = {
  name: 'Jon'
  birthDate: regex(/\d{2}\/\d{2}\/\d{4}/)
}

// actual === exp1 -> True
const exp1 = {
  name: 'Jon',
  birthDate: '02/02/2020'
}

// actual === exp2 -> False
const exp1 = {
  name: 'Jon',
  birthDate: '2/2/2020'
}
```
