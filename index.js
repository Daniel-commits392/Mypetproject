document.getElementById ('name');
document.getElementById('age');
document.getElementById ('dog-image')
document.getElementById ('submit')
document.getElementById ('town')
let allDogs = [];
let allBreeds = [];

document.addEventListener('DOMContentLoaded', () => {
  
  fetch("http://localhost:3000/breeds")
    .then(res => res.json())
    .then(breeds => {
      allBreeds = breeds;
      populateBreedOptions(breeds);

      
      return fetch("http://localhost:3000/dogs");
    })
    .then(res => res.json())
    .then(dogs => {
      allDogs = dogs;
      displayDogs(allDogs); 
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

 function getBreedName(breedId){
    const breed =allBreeds.find(b => b.id === breedId);
    return breed ? breed.name : 'Unknown Breed';
 }
function displayDogs (dogs) {

    const dogList =document.getElementById('doglist');
    dogList.innerHTML =""
    

     dogs.forEach(dog =>{
        const li =document.createElement('li');
        const img =document.createElement('img');

        img.src = dog.image || "https://via.placeholder.com/300x200?text=No+Image";
    img.alt = `${dog.name} - ${getBreedName(dog.breedId)}`;
    img.onerror = () => {
      img.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
    };
        const info =document.createElement('p');
       info.textContent = `${dog.name} (${getBreedName(dog.breedId)})`;


        li.appendChild(img);
        li.appendChild(info);
        dogList.appendChild(li);
         });
    
 }

 document.getElementById('search-button').addEventListener('click',function(){
    let input =document.getElementById('dog-breed').value.toLowerCase();
    let results =[];

    for (let i=0;i < allDogs.length; i++) {
        let breedName =getBreedName(allDogs[i].breedId).toLowerCase()

        if (breedName===input){
            results.push(allDogs[i]);
        }
    }
        if (results.length===0){
            const dogList=document.getElementById('doglist');
            dogList.innerHTML = '<li>No dogs found with that breed.</li>'
        }else{
           displayDogs(results);   
    }
 });

 function populateBreedOptions(breeds) {
  const breedSelect = document.getElementById('breed-select');
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}



document.getElementById('submit').addEventListener('click',()=> {
    const name =document.getElementById ('name').value.trim();
    const age =document.getElementById('age').value.trim();
    const town =document.getElementById ('town').value.trim();
    const image=document.getElementById  ('dog-image').value.trim();
    const breedId = document.getElementById('breed-select').value;
    if (!name || !age || !town || !image || !breedId){
        alert('Please fill in all the fields');
        return;
    }

    const newDog ={
        name:name,
        age :age,
        town:town,
        image:image,
        breedId:parseInt(breedId)
    };

    fetch("http://localhost:3000/dogs",{
        method: 'POST',
        headers:{'Content-Type':'application/json' },
        body :JSON.stringify(newDog)
    })
    .then(res => res.json())
    .then(addedDog =>{
        allDogs.push(addedDog);
        displayDogs(allDogs);
        clearForm();
        document.getElementById('form-success').textContent = "🐶 Dog added successfully!";
    })
    .catch(error=>{
        console.log('Error adding dog',error);
    });

});

function clearForm(){
  document.getElementById('name').value = '';
  document.getElementById('age').value = '';
  document.getElementById('town').value = '';
  document.getElementById('dog-image').value = '';
};