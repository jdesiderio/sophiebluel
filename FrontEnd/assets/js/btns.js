fetch('http://localhost:5678/api/works', { method: 'GET' })
.then((response) => response.json())
.then((json) => { 
  let works = json;

  const category = works.map(works => works.category);
  // let categoryName = works.map(works => works.category.name);
  // let categoryId = works.map(works => works.categoryId);
  // categoryId = works.map(works => works.category.id);
  console.log(category);

  const distinctCat = [];
  const map = new Map();
  for (const item of category) {
      if(!map.has(item.id)){
          map.set(item.id, true);
          distinctCat.push({
              id: item.id,
              name: item.name
          });
      }
  };
  console.log(distinctCat);

  function generateBtns() {
    for (let i = 0; i < distinctCat.length; i++) {
    const btn = distinctCat[i];
    const filters = document.querySelector(".filters");
    const btnElement = document.createElement("button");
    btnElement.innerText = btn.name;
    filters.appendChild(btnElement);
    };
  } 
  generateBtns();
})