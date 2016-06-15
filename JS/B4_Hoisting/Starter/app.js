  /*b();
  console.log(a);*/

// -- Hoisting ^ --

var a = 'Hello World!';

function b() {
  console.log('Called b!');
    
}


b();
console.log(a);